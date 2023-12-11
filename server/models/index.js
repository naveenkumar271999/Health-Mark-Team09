const express = require('express');
const User = require('./userModel');
const Product = require('./productModel');
const Cart = require('./CartModel');

module.exports = {
    User,
    Product,
    Cart,
};
