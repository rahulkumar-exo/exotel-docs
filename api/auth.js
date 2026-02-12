/**
 * Vercel Serverless Function: OAuth - Initiate GitHub login
 *
 * Redirects the user to GitHub's OAuth authorization page.
 * Decap CMS calls this endpoint when the user clicks "Login with GitHub".
 */
module.exports = async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({ error: 'OAUTH_GITHUB_CLIENT_ID not configured' });
  }

  const authUrl = 'https://github.com/login/oauth/authorize?client_id=' + clientId + '&scope=repo,user';

  res.redirect(authUrl);
};
