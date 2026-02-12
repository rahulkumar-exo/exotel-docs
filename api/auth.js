/**
 * Vercel Serverless Function: OAuth - Initiate GitHub login
 *
 * Redirects the user to GitHub's OAuth authorization page.
 * Decap CMS calls this endpoint when the user clicks "Login with GitHub".
 */
module.exports = (req, res) => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`;

  res.writeHead(302, { Location: authUrl });
  res.end();
};
