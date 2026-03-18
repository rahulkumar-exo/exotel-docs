/**
 * Diagnostic endpoint to test WordPress proxy from Vercel's runtime.
 * GET /api/proxy-test
 */
export default async function handler(req, res) {
  const targets = [
    { label: 'HTTPS developer.exotel.in + Host: developer.exotel.com', url: 'https://developer.exotel.in/', host: 'developer.exotel.com' },
    { label: 'HTTPS legacy-developer.exotel.in + Host: developer.exotel.com', url: 'https://legacy-developer.exotel.in/', host: 'developer.exotel.com' },
    { label: 'HTTPS legacy-developer.exotel.in (no Host override)', url: 'https://legacy-developer.exotel.in/', host: null },
    { label: 'HTTP 167.71.226.61 + Host: developer.exotel.com', url: 'http://167.71.226.61/', host: 'developer.exotel.com' },
  ];

  const results = [];

  for (const target of targets) {
    try {
      const headers = {};
      if (target.host) headers['Host'] = target.host;

      const start = Date.now();
      const resp = await fetch(target.url, {
        headers,
        redirect: 'manual',
      });
      const elapsed = Date.now() - start;

      const body = await resp.text();
      const isWordPress = body.includes('wp-content') || body.includes('wp-json') || body.includes('WordPress');
      const isDocusaurus = body.includes('Docusaurus') || body.includes('docusaurus');

      results.push({
        label: target.label,
        status: resp.status,
        elapsed: `${elapsed}ms`,
        server: resp.headers.get('server'),
        location: resp.headers.get('location'),
        isWordPress,
        isDocusaurus,
        bodySnippet: body.substring(0, 200),
      });
    } catch (err) {
      results.push({
        label: target.label,
        error: err.message,
        errorType: err.constructor.name,
      });
    }
  }

  res.status(200).json({ results });
}
