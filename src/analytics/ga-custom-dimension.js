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

// GA4 global config: attach site_variant to ALL future events
if (typeof window !== 'undefined') {
  // Set on initial load — gtag may not be ready immediately
  const setGlobalDimension = () => {
    if (typeof gtag === 'function') {
      // This makes site_variant appear on every subsequent event
      gtag('set', { site_variant: 'new_portal' });
      // Also configure it at the config level for the tracking ID
      gtag('config', 'G-HWCFMYZ4FG', {
        site_variant: 'new_portal',
        send_page_view: false, // Docusaurus gtag plugin already sends page views
      });
      return true;
    }
    return false;
  };

  // Try immediately, then retry every 500ms for up to 5s
  if (!setGlobalDimension()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (setGlobalDimension() || attempts >= 10) {
        clearInterval(interval);
      }
    }, 500);
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
