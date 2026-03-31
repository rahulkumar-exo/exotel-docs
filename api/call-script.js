/**
 * Vercel Serverless Function: Exotel ExoML Script Endpoint
 *
 * Called by Exotel when an outbound AI call connects.
 * Returns ExoML that tells Exotel what to say on the call.
 *
 * Query params:
 *   text  — the script to speak (URL-encoded)
 *   lang  — language code (default: en)
 *   voice — "man" or "woman" (default: woman)
 */

module.exports = function callScript(req, res) {
  // Only allow GET and POST (Exotel uses POST for callbacks)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Get text from query param, POST body, or use a default test message
  const text = req.query.text || req.body?.text || "Hello. This is a test call from the AI booking agent. The system is working correctly.";

  const lang = req.query.lang || 'en';
  const voice = req.query.voice === 'man' ? 'man' : 'woman';

  // Sanitise: strip XML special chars so ExoML doesn't break
  const safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const exoml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}" language="${lang}">${safe}</Say>
  <Pause length="2"/>
  <Hangup/>
</Response>`;

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(exoml);
};
