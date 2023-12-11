const { sessionSecret } = require('../config');

const generateToken = (user) => {
    return jwt.sign({ user }, sessionSecret, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, sessionSecret);
};
