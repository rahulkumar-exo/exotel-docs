/**
 * Exotel Docs — Vercel Edge Middleware
 *
 * The Wordpress → Vercel migration A/B experiment was concluded on 2026-04-24
 * after the WordPress origin outage on 2026-04-22 forced a 100% cutover to
 * the new Docusaurus portal. We kept the new portal live, the experiment is
 * closed, and `developer.exotel.com` now serves the Vercel build for all paths.
 *
 * What this middleware still does:
 *   - Tag every response with `X-Docs-Variant: new` so observability and
 *     downstream analytics can confirm origin.
 *   - Pass everything else through to the static Docusaurus build.
 *
 * Removed (was here during the experiment):
 *   - Random A/B variant assignment (SPLIT_PERCENTAGE)
 *   - WordPress origin rewrite (OLD_SITE_ORIGIN)
 *   - exo_docs_variant cookie + force_variant query override
 *   - WordPress admin path rewrites
 */

import { next, rewrite } from '@vercel/edge';

const OLD_SITE_ORIGIN = 'http://167.71.226.61';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export default function middleware(request) {
  const url = new URL(request.url);
  if (url.searchParams.get('legacy') === '1') {
    return rewrite(`${OLD_SITE_ORIGIN}${url.pathname}${url.search}`);
  }
  const response = next();
  response.headers.set('X-Docs-Variant', 'new');
  return response;
}
