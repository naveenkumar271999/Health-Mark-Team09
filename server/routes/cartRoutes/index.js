const express = require('express');
const Router = express.Router();
const cartController = require('../../controllers/cartController');
const authenticate = require('../../middleware/authenticate');

Router.get('/', authenticate, cartController.getCart);
Router.post('/', authenticate, cartController.createCart);
Router.post('/items', authenticate, cartController.addItemToCart);
Router.put('/items/:id', authenticate, cartController.updateItemInCart);
Router.delete('/items/:id', authenticate, cartController.deleteItemFromCart);
Router.delete('/', authenticate, cartController.deleteCart);
Router.post('/checkout', authenticate, cartController.checkoutCart);

module.exports = Router;