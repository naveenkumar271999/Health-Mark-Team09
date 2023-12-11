const http = require('http');
const app = require('./app'); // Import your Express app

const { mongoose } = require('./database/database');
const seedDatabase = require('./database/dummy');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);
seedDatabase(); 

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
