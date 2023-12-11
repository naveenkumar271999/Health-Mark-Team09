const express = require('express');
const expressSession = require('express-session');
const app = express();

// to require env file
require('dotenv').config();

const sessionSecret = require('./config')
// to parse requests
app.use(express.json());

const cors = require('cors');
app.use(cors({origin: '*'}));

// setting session
app.use(expressSession({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// setting up routes
const routes = require('./routes');
app.use('/api', routes);

// exporting app, that'll be used in server
module.exports = app;