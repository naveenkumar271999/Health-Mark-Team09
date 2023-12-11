// config.js
module.exports = {
    mongoURI: process.env.MONGODB_URI_DEV || 'mongodb://localhost:27017/Health Mark',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '#',
    adminEmail: process.env.EMAIL,
    adminPassword: process.env.PASSWORD,
    sessionSecret: process.env.SESSION_SECRET,
    enviroment: process.env.NODE_ENV,
    sgAPIKey: process.env.SENDGRID_API_KEY,
    baseUrlClient: process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '#',
};
