/**
 * Exotel Docs A/B Testing — AWS Lambda@Edge (Viewer Request)
 *
 * Deployed as a Lambda@Edge function attached to a CloudFront distribution.
 * Runs at the edge on every viewer request, BEFORE CloudFront checks its cache.
 *
 * HOW IT WORKS:
 * 1. CloudFront sits in front of developer.exotel.com (Route 53 → CloudFront)
 * 2. This Lambda runs on every request
 * 3. Checks for 'exo_docs_variant' cookie
 * 4. If no cookie → randomly assign variant, set cookie
 * 5. Routes to correct origin based on variant:
 *    - "new" → Vercel origin (exotel-docs.vercel.app)
 *    - "old" → WordPress origin (existing server)
 *
 * DEPLOYMENT:
 * - Region: us-east-1 (REQUIRED for Lambda@Edge)
 * - Runtime: Node.js 20.x
 * - Trigger: CloudFront Viewer Request
 * - Memory: 128 MB (minimum, sufficient for this)
 * - Timeout: 5 seconds (Lambda@Edge limit for viewer request)
 *
 * IMPORTANT Lambda@Edge Constraints:
 * - Must be deployed in us-east-1
 * - Cannot use environment variables (config is hardcoded)
 * - Max 1MB deployment package (viewer request)
 * - Max 5s timeout (viewer request)
 * - Cannot access VPC resources
 */

'use strict';

// ============================================================
// CONFIGURATION — Change these values to control the A/B test
// ============================================================

const CONFIG = {
  // Traffic split: percentage of NEW visitors who see the new site
  // Week 1: 10, Week 2: 25, Week 3: 50, Week 4: 100
  SPLIT_PERCENTAGE: 10,

  // Origins
  NEW_SITE_HOST: 'exotel-docs.vercel.app',
  OLD_SITE_HOST: 'developer.exotel.com',  // Current WordPress server

  // Cookie settings
  COOKIE_NAME: 'exo_docs_variant',
  COOKIE_MAX_AGE: 2592000,  // 30 days in seconds

  // Allow ?force_variant=new|old for testing
  ALLOW_FORCE_VARIANT: true,

  // Paths that ONLY exist on the new site (always route to Vercel)
  NEW_ONLY_PATHS: [
    '/docs/getting-started', '/docs/call-support', '/docs/sms-support',
    '/docs/whatsapp-support', '/docs/campaign-guides', '/docs/billing',
    '/docs/reporting', '/docs/advanced-config', '/docs/app-bazaar',
    '/docs/chatbot', '/docs/vsip', '/docs/agentstream',
    '/docs/integrations', '/docs/faqs',
  ],

  // WordPress admin paths — always route to WordPress
  WP_ADMIN_PATHS: ['/wp-admin', '/wp-login.php', '/wp-content', '/wp-includes'],
};

// ============================================================
// LAMBDA@EDGE HANDLER — Viewer Request
// ============================================================

exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;
  const uri = request.uri;
  const querystring = request.querystring || '';

  // 1. Skip static assets (let CloudFront handle caching)
  if (isStaticAsset(uri)) {
    return request;
  }

  // 2. WordPress admin → always route to WordPress origin
  if (CONFIG.WP_ADMIN_PATHS.some(p => uri.startsWith(p))) {
    setOrigin(request, CONFIG.OLD_SITE_HOST);
    addHeader(request, 'X-Docs-Variant', 'old');
    return request;
  }

  // 3. New-only paths → always route to Vercel
  if (CONFIG.NEW_ONLY_PATHS.some(p => uri.startsWith(p))) {
    setOrigin(request, CONFIG.NEW_SITE_HOST);
    addHeader(request, 'X-Docs-Variant', 'new');
    return request;
  }

  // 4. Parse cookies
  const cookies = parseCookies(headers);
  let variant = cookies[CONFIG.COOKIE_NAME];
  let needsCookie = false;

  // 5. Check for force_variant query parameter (testing)
  if (CONFIG.ALLOW_FORCE_VARIANT && querystring) {
    const params = new URLSearchParams(querystring);
    const forceVariant = params.get('force_variant');
    if (forceVariant === 'new' || forceVariant === 'old') {
      variant = forceVariant;
      needsCookie = true;
    }
  }

  // 6. Assign variant for new visitors
  if (!variant || (variant !== 'new' && variant !== 'old')) {
    variant = Math.random() * 100 < CONFIG.SPLIT_PERCENTAGE ? 'new' : 'old';
    needsCookie = true;
  }

  // 7. Route to appropriate origin
  if (variant === 'new') {
    setOrigin(request, CONFIG.NEW_SITE_HOST);
  } else {
    setOrigin(request, CONFIG.OLD_SITE_HOST);
  }

  // 8. If we need to set a cookie, we must use a response (not a request modification)
  // Lambda@Edge viewer-request can't set response cookies directly.
  // Instead, we add a custom header that the Origin Response trigger can use.
  if (needsCookie) {
    addHeader(request, 'X-AB-Set-Cookie', `${CONFIG.COOKIE_NAME}=${variant}`);
  }

  // 9. Add debug headers
  addHeader(request, 'X-Docs-Variant', variant);
  addHeader(request, 'X-Docs-Split', `${CONFIG.SPLIT_PERCENTAGE}`);

  return request;
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Set the origin for this request (switch between WordPress and Vercel)
 */
function setOrigin(request, host) {
  request.origin = {
    custom: {
      domainName: host,
      port: 443,
      protocol: 'https',
      path: '',
      sslProtocols: ['TLSv1.2'],
      readTimeout: 30,
      keepaliveTimeout: 5,
    },
  };
  // Set Host header to match the origin
  request.headers['host'] = [{ key: 'Host', value: host }];
}

/**
 * Add a custom header to the request
 */
function addHeader(request, key, value) {
  request.headers[key.toLowerCase()] = [{ key, value }];
}

/**
 * Parse cookies from CloudFront request headers
 */
function parseCookies(headers) {
  const cookies = {};
  if (headers.cookie) {
    headers.cookie.forEach(cookieHeader => {
      cookieHeader.value.split(';').forEach(cookie => {
        const parts = cookie.trim().split('=');
        if (parts.length >= 2) {
          cookies[parts[0].trim()] = parts.slice(1).join('=').trim();
        }
      });
    });
  }
  return cookies;
}

/**
 * Check if URI is a static asset
 */
function isStaticAsset(uri) {
  const extensions = [
    '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.woff', '.woff2', '.ttf', '.eot', '.map', '.webp', '.avif',
    '.mp4', '.webm', '.pdf', '.zip',
  ];
  return extensions.some(ext => uri.endsWith(ext));
}
