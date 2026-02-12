module.exports = function(req, res) {
  res.status(200).json({
    ok: true,
    has_client_id: !!process.env.OAUTH_GITHUB_CLIENT_ID,
    node_version: process.version
  });
};
