/**
 * Exotel Docs A/B Testing - Cloudflare Worker
 *
 * Deploys at the edge in front of developer.exotel.com.
 * Splits traffic between old WordPress site and new Docusaurus site.
 *
 * HOW IT WORKS:
 * 1. Visitor hits developer.exotel.com (DNS -> Cloudflare)
 * 2. Worker checks for 'exo_docs_variant' cookie
 * 3. If no cookie, randomly assigns visitor to 'new' or 'old' based on SPLIT_PERCENTAGE
 * 4. If 'new', proxies request to exotel-docs.vercel.app (transparent to user)
 * 5. If 'old', passes through to WordPress origin
 * 6. Sets sticky cookie so user always sees same version
 *
 * CONFIGURATION:
 * - Change SPLIT_PERCENTAGE to control traffic (0-100)
 * - Set to 0 for instant rollback
 * - Set to 100 for full cutover
 */

// ============================================================
// CONFIGURATION - Change these values to control the A/B test
// ============================================================

const CONFIG = {
  // Percentage of NEW visitors that see the new site (0-100)
  // Week 1: 10, Week 2: 25, Week 3: 50, Week 4: 100
  SPLIT_PERCENTAGE: 10,

  // New site origin (Vercel deployment)
  NEW_SITE_ORIGIN: 'https://exotel-docs.vercel.app',

  // Cookie name for sticky sessions
  COOKIE_NAME: 'exo_docs_variant',

  // Cookie duration in seconds (30 days)
  COOKIE_MAX_AGE: 30 * 24 * 60 * 60,

  // Analytics endpoint (optional - set to null to disable)
  ANALYTICS_ENDPOINT: null,

  // Force a specific variant for testing (set to null in production)
  // Use ?force_variant=new or ?force_variant=old in URL for testing
  ALLOW_FORCE_VARIANT: true,

  // Paths that should ALWAYS go to the old site (e.g., WordPress admin)
  OLD_SITE_ONLY_PATHS: [
    '/wp-admin',
    '/wp-login.php',
    '/wp-content',
    '/wp-includes',
    '/xmlrpc.php',
  ],

  // Paths that should ALWAYS go to the new site
  NEW_SITE_ONLY_PATHS: [
    '/docs/getting-started',
    '/docs/call-support',
    '/docs/sms-support',
    '/docs/whatsapp-support',
    '/docs/campaign-guides',
    '/docs/billing',
    '/docs/reporting',
    '/docs/advanced-config',
    '/docs/app-bazaar',
    '/docs/chatbot',
    '/docs/vsip',
    '/docs/agentstream',
    '/docs/integrations',
    '/docs/faqs',
  ],
};

// ============================================================
// WORKER LOGIC
// ============================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Skip static assets - pass through to origin
    if (isStaticAsset(path)) {
      return fetch(request);
    }

    // WordPress admin paths always go to old site
    if (CONFIG.OLD_SITE_ONLY_PATHS.some(p => path.startsWith(p))) {
      return fetch(request);
    }

    // New-only paths (support content that only exists on new site)
    if (CONFIG.NEW_SITE_ONLY_PATHS.some(p => path.startsWith(p))) {
      return proxyToNewSite(request, url);
    }

    // Determine variant assignment
    let variant = getVariantFromCookie(request);
    let isNewAssignment = false;

    // Allow force variant via query param (for testing)
    if (CONFIG.ALLOW_FORCE_VARIANT) {
      const forceVariant = url.searchParams.get('force_variant');
      if (forceVariant === 'new' || forceVariant === 'old') {
        variant = forceVariant;
        isNewAssignment = true;
      }
    }

    // If no existing assignment, randomly assign
    if (!variant) {
      variant = Math.random() * 100 < CONFIG.SPLIT_PERCENTAGE ? 'new' : 'old';
      isNewAssignment = true;
    }

    // Route based on variant
    let response;
    if (variant === 'new') {
      response = await proxyToNewSite(request, url);
    } else {
      response = await fetch(request);
    }

    // Clone response to modify headers
    response = new Response(response.body, response);

    // Set sticky session cookie if this is a new assignment
    if (isNewAssignment) {
      response.headers.append(
        'Set-Cookie',
        `${CONFIG.COOKIE_NAME}=${variant}; Path=/; Max-Age=${CONFIG.COOKIE_MAX_AGE}; SameSite=Lax; Secure`
      );
    }

    // Add variant header for debugging/monitoring
    response.headers.set('X-Docs-Variant', variant);
    response.headers.set('X-Docs-Split', `${CONFIG.SPLIT_PERCENTAGE}%`);

    // Track the assignment (non-blocking)
    if (CONFIG.ANALYTICS_ENDPOINT) {
      ctx.waitUntil(trackAssignment(request, variant, isNewAssignment));
    }

    return response;
  },
};

/**
 * Proxy request to the new Docusaurus site on Vercel
 */
async function proxyToNewSite(request, url) {
  const newUrl = new URL(url.pathname + url.search, CONFIG.NEW_SITE_ORIGIN);

  const newRequest = new Request(newUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow',
  });

  // Set the Host header to the Vercel domain
  newRequest.headers.set('Host', new URL(CONFIG.NEW_SITE_ORIGIN).host);

  // Forward the original host for analytics
  newRequest.headers.set('X-Forwarded-Host', url.host);
  newRequest.headers.set('X-Original-URL', url.toString());

  try {
    const response = await fetch(newRequest);
    return response;
  } catch (error) {
    // If new site is down, fall back to old site
    console.error('New site proxy failed, falling back to old site:', error);
    return fetch(request);
  }
}

/**
 * Extract variant from cookie
 */
function getVariantFromCookie(request) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === CONFIG.COOKIE_NAME) {
      if (value === 'new' || value === 'old') {
        return value;
      }
    }
  }
  return null;
}

/**
 * Check if path is a static asset (skip A/B logic)
 */
function isStaticAsset(path) {
  const staticExtensions = [
    '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg',
    '.ico', '.woff', '.woff2', '.ttf', '.eot', '.map',
    '.webp', '.avif', '.mp4', '.webm',
  ];
  return staticExtensions.some(ext => path.endsWith(ext));
}

/**
 * Track variant assignment for analytics (non-blocking)
 */
async function trackAssignment(request, variant, isNew) {
  if (!CONFIG.ANALYTICS_ENDPOINT) return;

  try {
    await fetch(CONFIG.ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        variant,
        isNewAssignment: isNew,
        path: new URL(request.url).pathname,
        userAgent: request.headers.get('User-Agent'),
        country: request.headers.get('CF-IPCountry'),
        splitPercentage: CONFIG.SPLIT_PERCENTAGE,
      }),
    });
  } catch (e) {
    // Silently fail - don't affect user experience
  }
}
