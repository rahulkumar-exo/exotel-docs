/**
 * Exotel Docs A/B Testing - Vercel Edge Middleware
 *
 * ALTERNATIVE APPROACH: Use this if Cloudflare is not available.
 *
 * HOW IT WORKS:
 * 1. Point developer.exotel.com DNS to Vercel (add as custom domain)
 * 2. This middleware runs at the edge on every request
 * 3. Assigns visitors to 'new' (serve Docusaurus) or 'old' (proxy to WordPress)
 * 4. Sticky sessions via cookie
 *
 * SETUP:
 * 1. Copy this file to the project root as middleware.ts
 * 2. Add developer.exotel.com as a custom domain in Vercel project settings
 * 3. Set OLD_SITE_ORIGIN to the WordPress server's IP or backup domain
 * 4. Deploy
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  SPLIT_PERCENTAGE: 10,               // % of new visitors seeing new site
  OLD_SITE_ORIGIN: 'https://old-developer.exotel.com',  // WordPress origin (use backup domain/IP)
  COOKIE_NAME: 'exo_docs_variant',
  COOKIE_MAX_AGE: 30 * 24 * 60 * 60,  // 30 days in seconds
  ALLOW_FORCE_VARIANT: true,

  // WordPress paths - always proxy to old site
  OLD_SITE_ONLY_PATHS: [
    '/wp-admin',
    '/wp-login.php',
    '/wp-content',
    '/wp-includes',
  ],

  // New content paths - always serve from Docusaurus
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
// MIDDLEWARE
// ============================================================

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;

  // Skip static assets
  if (isStaticAsset(path)) {
    return NextResponse.next();
  }

  // WordPress admin -> always old site
  if (CONFIG.OLD_SITE_ONLY_PATHS.some(p => path.startsWith(p))) {
    return rewriteToOldSite(request);
  }

  // New-only content -> always serve new site
  if (CONFIG.NEW_SITE_ONLY_PATHS.some(p => path.startsWith(p))) {
    return addVariantHeaders(NextResponse.next(), 'new');
  }

  // Get variant assignment
  let variant = request.cookies.get(CONFIG.COOKIE_NAME)?.value;
  let isNewAssignment = false;

  // Force variant via query param (testing)
  if (CONFIG.ALLOW_FORCE_VARIANT) {
    const forceVariant = url.searchParams.get('force_variant');
    if (forceVariant === 'new' || forceVariant === 'old') {
      variant = forceVariant;
      isNewAssignment = true;
    }
  }

  // Random assignment for new visitors
  if (!variant || (variant !== 'new' && variant !== 'old')) {
    variant = Math.random() * 100 < CONFIG.SPLIT_PERCENTAGE ? 'new' : 'old';
    isNewAssignment = true;
  }

  // Route based on variant
  let response: NextResponse;

  if (variant === 'old') {
    response = rewriteToOldSite(request);
  } else {
    response = addVariantHeaders(NextResponse.next(), 'new');
  }

  // Set sticky cookie for new assignments
  if (isNewAssignment) {
    response.cookies.set(CONFIG.COOKIE_NAME, variant, {
      path: '/',
      maxAge: CONFIG.COOKIE_MAX_AGE,
      sameSite: 'lax',
      secure: true,
    });
  }

  return response;
}

function rewriteToOldSite(request: NextRequest): NextResponse {
  const oldUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, CONFIG.OLD_SITE_ORIGIN);
  const response = NextResponse.rewrite(oldUrl);
  return addVariantHeaders(response, 'old');
}

function addVariantHeaders(response: NextResponse, variant: string): NextResponse {
  response.headers.set('X-Docs-Variant', variant);
  response.headers.set('X-Docs-Split', `${CONFIG.SPLIT_PERCENTAGE}%`);
  return response;
}

function isStaticAsset(path: string): boolean {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.map', '.webp'];
  return staticExtensions.some(ext => path.endsWith(ext));
}

// Only run middleware on page requests, not API routes or static files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
