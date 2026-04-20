/**
 * Tags all GA4 events with site_variant = "new_portal"
 * so we can distinguish new Docusaurus traffic from old WordPress traffic
 * in Google Analytics dashboards.
 *
 * IMPORTANT: You must register "site_variant" as a custom dimension in GA4:
 *   GA4 Admin → Custom definitions → Create custom dimension
 *   Name: "Site Variant", Scope: Event, Parameter: "site_variant"
 *
 * This module uses Docusaurus's onRouteDidUpdate lifecycle to tag
 * every page navigation (not just the initial load).
 */

// Push site_variant into dataLayer BEFORE gtag loads, so the very first
// page_view and first_visit events carry the dimension. Using user_properties
// makes this persist across all events for the user (not just the current one),
// which requires the custom dimension to be registered at USER scope in GA4.
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];

  // 1. User property — sticks for the whole user lifetime (requires User-scoped dim)
  window.dataLayer.push({
    event: 'gtm.js',
    user_properties: { site_variant: 'new_portal' },
  });

  // 2. Event-scope fallback — also attach to every future event
  window.dataLayer.push(['set', { site_variant: 'new_portal' }]);

  // 3. Configure once gtag loads (belt-and-braces, doesn't cause double page_view)
  const setGlobalDimension = () => {
    if (typeof gtag === 'function') {
      gtag('set', 'user_properties', { site_variant: 'new_portal' });
      gtag('set', { site_variant: 'new_portal' });
      return true;
    }
    return false;
  };

  if (!setGlobalDimension()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (setGlobalDimension() || attempts >= 10) {
        clearInterval(interval);
      }
    }, 250);
  }
}

// Docusaurus lifecycle: fires on every SPA navigation
export function onRouteDidUpdate({ location }) {
  if (typeof gtag === 'function') {
    gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      site_variant: 'new_portal',
    });
  }
}
