/**
 * Tags all GA events with site_variant = "new_portal"
 * so we can distinguish new Docusaurus traffic from old WordPress traffic
 * in Google Analytics dashboards.
 */
if (typeof window !== 'undefined') {
  window.addEventListener('load', function () {
    if (typeof gtag === 'function') {
      gtag('set', { site_variant: 'new_portal' });
      gtag('event', 'page_view_variant', {
        site_variant: 'new_portal',
        custom_map: { dimension1: 'site_variant' },
      });
    }
  });
}
