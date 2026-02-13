/**
 * Simple email/password auth for CMS.
 *
 * Validates credentials against CMS_USERS env var and returns
 * a shared GitHub bot token for repo access.
 *
 * CMS_USERS env var format: "email1:password1,email2:password2"
 * CMS_GITHUB_TOKEN env var: A GitHub PAT with repo scope
 */
module.exports = function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Parse authorized users from env var
  const usersStr = (process.env.CMS_USERS || '').trim();
  if (!usersStr) {
    return res.status(500).json({ error: 'CMS users not configured' });
  }

  const users = usersStr.split(',').map(u => {
    const [e, p] = u.trim().split(':');
    return { email: (e || '').trim().toLowerCase(), password: (p || '').trim() };
  });

  // Validate credentials
  const matched = users.find(
    u => u.email === email.trim().toLowerCase() && u.password === password
  );

  if (!matched) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Return the shared GitHub token
  const token = (process.env.CMS_GITHUB_TOKEN || '').trim();
  if (!token) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  return res.status(200).json({ token, provider: 'github' });
};
