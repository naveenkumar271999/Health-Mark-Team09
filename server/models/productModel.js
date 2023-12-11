const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  units: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  vendorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (assuming 'User' is the model name for users)
    required: true,
  },
  image: {
    type: String,
  },
  ageRestricted: {
    type: Boolean,
    default: false,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
