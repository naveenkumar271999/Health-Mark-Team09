const jwt = require('jsonwebtoken');
const { sessionSecret } = require('../config');

const authenticate = (req, res, next) => {
  let token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  token = token.split(' ')[1]; // Remove Bearer from string

  try {
    const decoded = jwt.verify(token, sessionSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticate;
