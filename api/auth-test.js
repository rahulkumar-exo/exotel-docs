module.exports = function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const usersStr = (process.env.CMS_USERS || 'NOT_SET').trim();
  const users = usersStr === 'NOT_SET' ? [] : usersStr.split(',').map(u => {
    const [e] = u.trim().split(':');
    return (e || '').trim().toLowerCase();
  });
  res.status(200).json({ emails: users, raw_length: usersStr.length });
};
