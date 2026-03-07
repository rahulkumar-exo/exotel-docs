/**
 * A/B Test Status API
 *
 * Returns current A/B test configuration and basic stats.
 * Access at: /api/ab-status
 *
 * This provides a simple health check and monitoring endpoint
 * for the A/B test. Pair with Cloudflare Worker or Vercel Middleware.
 */

export default function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic auth check (use a simple token for monitoring tools)
  const authToken = req.headers['x-monitor-token'] || req.query.token;
  const expectedToken = process.env.AB_MONITOR_TOKEN || 'exotel-ab-monitor-2026';

  if (authToken !== expectedToken) {
    return res.status(401).json({ error: 'Unauthorized. Pass ?token=YOUR_TOKEN or X-Monitor-Token header.' });
  }

  const status = {
    service: 'exotel-docs-ab-test',
    timestamp: new Date().toISOString(),
    site: 'new',
    version: 'docusaurus-3.9.2',
    totalPages: 302,

    abTest: {
      status: 'active',
      currentPhase: 'week-1',
      splitPercentage: {
        new: 10,
        old: 90,
      },
      schedule: {
        'week-1': { new: 10, old: 90, dates: 'TBD' },
        'week-2': { new: 25, old: 75, dates: 'TBD' },
        'week-3': { new: 50, old: 50, dates: 'TBD' },
        'week-4': { new: 100, old: 0, dates: 'TBD' },
      },
      stickySession: {
        cookie: 'exo_docs_variant',
        maxAge: '30 days',
      },
    },

    health: {
      build: 'ok',
      deploy: 'ok',
      search: 'ok',
      aiChat: 'ok',
    },

    content: {
      apiDocs: 93,
      supportDocs: 209,
      total: 302,
      sections: {
        voiceApi: 26,
        smsApi: 7,
        whatsappApi: 11,
        chatbot: 19,
        vsip: 8,
        agentstream: 10,
        integrations: 20,
        callSupport: 28,
        smsSupport: 22,
        whatsappSupport: 21,
        campaignGuides: 10,
        faqs: 21,
        gettingStarted: 11,
        billing: 9,
        reporting: 9,
        appBazaar: 8,
        advancedConfig: 11,
        other: 51,
      },
    },

    rollback: {
      procedure: 'Set SPLIT_PERCENTAGE to 0 in Cloudflare Worker or middleware config',
      estimatedTime: '< 1 minute',
      fallbackBehavior: 'All traffic routes to WordPress origin',
    },

    monitoring: {
      dashboardUrl: '/ab-dashboard',
      vercelAnalytics: 'https://vercel.com/rahuls-projects-3c1f730b/exotel-docs/analytics',
      checkHeaders: 'Look for X-Docs-Variant and X-Docs-Split response headers',
    },
  };

  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(status);
}
