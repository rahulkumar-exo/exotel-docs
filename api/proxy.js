/**
 * API Proxy for the Try It console.
 * Forwards requests to Exotel's API to avoid CORS restrictions.
 * Runs as a Vercel serverless function.
 */
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Kill switch — set TRY_IT_TEMPORARILY_DISABLED=1 in Vercel env to disable.
  if (process.env.TRY_IT_TEMPORARILY_DISABLED === '1') {
    return res.status(503).json({
      error: 'The Try It console is temporarily unavailable. Please use the curl/code examples on the page to make API calls directly.',
      disabled: true,
    });
  }

  const { method, subdomain, path, apiKey, apiToken, body, bodyContentType } = req.body || {};

  if (!method || !subdomain || !path || !apiKey || !apiToken) {
    return res.status(400).json({ error: 'Missing required fields: method, subdomain, path, apiKey, apiToken' });
  }

  // Only allow requests to Exotel API domains
  const allowedDomains = ['api.exotel.com', 'api.in.exotel.com'];
  if (!allowedDomains.includes(subdomain)) {
    return res.status(400).json({ error: 'Invalid subdomain' });
  }

  const url = `https://${subdomain}${path}`;
  const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiToken}`).toString('base64');

  const fetchOptions = {
    method: method,
    headers: {
      'Authorization': authHeader,
    },
  };

  if (body && method !== 'GET') {
    fetchOptions.body = body;
    if (bodyContentType) {
      fetchOptions.headers['Content-Type'] = bodyContentType;
    }
  }

  try {
    const response = await fetch(url, fetchOptions);
    const responseText = await response.text();

    return res.status(200).json({
      status: response.status,
      body: responseText,
    });
  } catch (err) {
    return res.status(502).json({
      status: 0,
      body: 'Proxy error: ' + (err.message || 'Failed to reach Exotel API'),
    });
  }
};
