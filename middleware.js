/**
 * Exotel Docs A/B Testing — Vercel Edge Middleware
 *
 * This runs at Vercel's edge BEFORE any file lookup.
 * It handles cookie-based sticky sessions for A/B testing.
 *
 * Placed at project root as middleware.js for Vercel's native middleware support.
 */

import { next } from '@vercel/edge';

// ============================================================
// CONFIGURATION — Change SPLIT_PERCENTAGE to control traffic
// ============================================================
const SPLIT_PERCENTAGE = 2;   // Start at 2%, then ramp: 10 → 25 → 50 → 100
const OLD_SITE_ORIGIN = 'https://legacy-developer.exotel.in';
const COOKIE_NAME = 'exo_docs_variant';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;  // 30 days

// Paths that ONLY exist on the new site
const NEW_ONLY_PATHS = [
  '/docs/getting-started', '/docs/call-support', '/docs/sms-support',
  '/docs/whatsapp-support', '/docs/campaign-guides', '/docs/billing',
  '/docs/reporting', '/docs/advanced-config', '/docs/app-bazaar',
  '/docs/chatbot', '/docs/vsip', '/docs/agentstream',
  '/docs/integrations', '/docs/faqs', '/docs/voicebot-tools',
];

// WordPress admin paths — always proxy to old site
const WP_ADMIN_PATHS = ['/wp-admin', '/wp-login.php', '/wp-content', '/wp-includes'];

// Static asset extensions — skip A/B logic
const STATIC_EXTENSIONS = [
  '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.eot', '.map', '.webp', '.avif', '.json',
  '.yaml', '.yml',
];

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. Skip static assets entirely
  if (STATIC_EXTENSIONS.some(ext => path.endsWith(ext))) {
    return next();
  }

  // 2. Skip API routes
  if (path.startsWith('/api/')) {
    return next();
  }

  // 3. WordPress admin → always proxy to old site
  if (WP_ADMIN_PATHS.some(p => path.startsWith(p))) {
    return proxyToOldSite(request, url);
  }

  // 4. New-only content → always serve new site
  if (NEW_ONLY_PATHS.some(p => path.startsWith(p))) {
    const resp = next();
    resp.headers.set('X-Docs-Variant', 'new');
    resp.headers.set('X-Docs-Split', `${SPLIT_PERCENTAGE}%`);
    return resp;
  }

  // 5. Determine variant
  let variant = getCookie(request, COOKIE_NAME);
  let needsCookie = false;

  // Allow ?force_variant=new|old for testing
  const forceVariant = url.searchParams.get('force_variant');
  if (forceVariant === 'new' || forceVariant === 'old') {
    variant = forceVariant;
    needsCookie = true;
  }

  // New visitor — randomly assign
  if (!variant || (variant !== 'new' && variant !== 'old')) {
    variant = Math.random() * 100 < SPLIT_PERCENTAGE ? 'new' : 'old';
    needsCookie = true;
  }

  // 6. Route based on variant
  let response;

  if (variant === 'old') {
    response = await proxyToOldSite(request, url);
  } else {
    response = next();
  }

  // 7. Set sticky session cookie
  if (needsCookie) {
    const cookieValue = `${COOKIE_NAME}=${variant}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure; HttpOnly`;
    response.headers.append('Set-Cookie', cookieValue);
  }

  // 8. Add debug headers
  response.headers.set('X-Docs-Variant', variant);
  response.headers.set('X-Docs-Split', `${SPLIT_PERCENTAGE}%`);

  return response;
}

async function proxyToOldSite(request, url) {
  const oldUrl = new URL(url.pathname + url.search, OLD_SITE_ORIGIN);

  try {
    const proxyResponse = await fetch(oldUrl.toString(), {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers.entries()),
        'Host': new URL(OLD_SITE_ORIGIN).host,
        'X-Forwarded-Host': url.host,
        'X-Forwarded-Proto': 'https',
      },
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'manual',
    });

    const response = new Response(proxyResponse.body, {
      status: proxyResponse.status,
      statusText: proxyResponse.statusText,
      headers: new Headers(proxyResponse.headers),
    });

    return response;
  } catch (error) {
    console.error('WordPress proxy failed:', error.message);
    return next();
  }
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}
