const mongoose = require('mongoose');
const config = require('../config'); // Adjust the import path as needed

async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
}

// Call the connectToDatabase function to establish the connection when needed
connectToDatabase();

module.exports = {
  mongoose, // Export the mongoose connection
};
