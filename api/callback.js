/**
 * Vercel Serverless Function: OAuth - GitHub callback
 *
 * After the user authorizes on GitHub, GitHub redirects here with a `code`.
 * This function exchanges the code for an access token, then sends it
 * back to the Decap CMS admin page via postMessage.
 */
const https = require('https');

module.exports = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    res.status(400).send('Missing code parameter');
    return;
  }

  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  try {
    // Exchange code for access token
    const tokenResponse = await new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      });

      const options = {
        hostname: 'github.com',
        path: '/login/oauth/access_token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Failed to parse response'));
          }
        });
      });

      request.on('error', reject);
      request.write(postData);
      request.end();
    });

    const token = tokenResponse.access_token;

    if (!token) {
      res.status(500).send('Failed to get access token: ' + JSON.stringify(tokenResponse));
      return;
    }

    // Send the token back to Decap CMS via postMessage
    const body = `
<!doctype html>
<html>
<body>
<script>
(function() {
  function recieveMessage(e) {
    console.log("recieveMessage %o", e);
    // send message to main window with the access token
    window.opener.postMessage(
      'authorization:github:success:{"token":"${token}","provider":"github"}',
      e.origin
    );
  }
  window.addEventListener("message", recieveMessage, false);
  // Start handshake with main window
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>`;

    res.status(200).send(body);
  } catch (error) {
    res.status(500).send('OAuth error: ' + error.message);
  }
};
