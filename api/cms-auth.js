export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const usersStr = (process.env.CMS_USERS || '').trim();
  if (!usersStr) return res.status(500).json({ error: 'CMS users not configured' });

  const users = usersStr.split(',').map(u => {
    const cidx = u.trim().indexOf(':');
    const e = cidx >= 0 ? u.trim().slice(0, cidx).trim() : u.trim();
    const p = cidx >= 0 ? u.trim().slice(cidx + 1).trim() : '';
    return { email: e.toLowerCase(), password: p };
  });

  const matched = users.find(
    u => u.email === email.trim().toLowerCase() && u.password === password.trim()
  );

  if (!matched) return res.status(401).json({ error: 'Invalid email or password' });

  const token = (process.env.CMS_GITHUB_TOKEN || '').trim();
  if (!token) return res.status(500).json({ error: 'GitHub token not configured' });

  return res.status(200).json({ token, provider: 'github' });
}
