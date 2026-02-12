/**
 * Vercel Serverless Function: OAuth - GitHub callback
 *
 * After the user authorizes on GitHub, GitHub redirects here with a `code`.
 * This function exchanges the code for an access token, then sends it
 * back to the Decap CMS admin page via postMessage.
 */
module.exports = async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  try {
    // Exchange code for access token
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const data = await response.json();
    const token = data.access_token;

    if (!token) {
      return res.status(500).send('Failed to get access token: ' + JSON.stringify(data));
    }

    // Send the token back to Decap CMS via postMessage
    const body = `<!doctype html><html><body><script>
(function() {
  function recieveMessage(e) {
    console.log("recieveMessage %o", e);
    window.opener.postMessage(
      'authorization:github:success:{"token":"${token}","provider":"github"}',
      e.origin
    );
  }
  window.addEventListener("message", recieveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script></body></html>`;

    res.status(200).send(body);
  } catch (error) {
    res.status(500).send('OAuth error: ' + error.message);
  }
};
