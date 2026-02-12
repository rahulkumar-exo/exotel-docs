module.exports = function(req, res) {
  var clientId = process.env.OAUTH_GITHUB_CLIENT_ID || '';
  var url = 'https://github.com/login/oauth/authorize?client_id=' + clientId + '&scope=repo,user';
  res.setHeader('Location', url);
  res.status(302).end();
};
