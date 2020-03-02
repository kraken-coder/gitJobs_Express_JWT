const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // get token
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'invalid token, access denied' });
  }
  try {
    const decoded = jwt.verify(token, config.get('secret'));
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ msg: 'token not valid' });
  }
};
