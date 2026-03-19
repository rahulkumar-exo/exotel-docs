/**
 * Exotel Docs A/B Testing — Vercel Edge Middleware
 *
 * Routes traffic between new Docusaurus site and old WordPress site.
 * Uses Vercel's rewrite() for the WordPress proxy (infrastructure-level,
 * avoids SSL/Host header issues that fetch() has in Edge Runtime).
 */

import { next, rewrite } from '@vercel/edge';

// ============================================================
// CONFIGURATION
// ============================================================
const SPLIT_PERCENTAGE = 1;   // 1% new, 99% old
const OLD_SITE_ORIGIN = 'http://167.71.226.61';
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

// WordPress admin paths
const WP_ADMIN_PATHS = ['/wp-admin', '/wp-login.php', '/wp-content', '/wp-includes'];

// Static asset extensions — skip A/B logic
const STATIC_EXTENSIONS = [
  '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.eot', '.map', '.webp', '.avif',
  '.json', '.yaml', '.yml', '.xml',
];

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export default function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 0. Only run A/B testing on developer.exotel.com — all other domains serve new site
  if (url.hostname !== 'developer.exotel.com') {
    return next();
  }

  // 1. Skip static assets
  if (STATIC_EXTENSIONS.some(ext => path.endsWith(ext))) {
    return next();
  }

  // 2. Skip API routes
  if (path.startsWith('/api/')) {
    return next();
  }

  // 3. WordPress admin → always rewrite to old site
  if (WP_ADMIN_PATHS.some(p => path.startsWith(p))) {
    return rewriteToOldSite(url);
  }

  // 4. New-only content → always serve new site
  if (NEW_ONLY_PATHS.some(p => path.startsWith(p))) {
    return addHeaders(next(), 'new', false);
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
    response = rewriteToOldSite(url);
  } else {
    response = next();
  }

  return addHeaders(response, variant, needsCookie);
}

/**
 * Rewrite to WordPress using Vercel's infrastructure-level rewrite.
 * This avoids the SSL/Host header issues that fetch() has in Edge Runtime.
 */
function rewriteToOldSite(url) {
  const oldUrl = `${OLD_SITE_ORIGIN}${url.pathname}${url.search}`;
  return rewrite(oldUrl);
}

function addHeaders(response, variant, needsCookie) {
  response.headers.set('X-Docs-Variant', variant);
  response.headers.set('X-Docs-Split', `${SPLIT_PERCENTAGE}%`);

  if (needsCookie) {
    const cookieValue = `${COOKIE_NAME}=${variant}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure; HttpOnly`;
    response.headers.append('Set-Cookie', cookieValue);
  }

  return response;
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}
