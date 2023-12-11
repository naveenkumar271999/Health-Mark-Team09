const express = require('express');
const { Cart } = require('../../models');
const { default: mongoose } = require('mongoose');
const stripe = require('stripe')('sk_test_51OEOecEmpCkUstvcPQN6Ac99kxpeelJoqhc9tbXLxOX1bjSaSs4CSmtg7f8ZvQVQh0gm4pBMrjp3zjcXCdwHB3NB004n5h91oQ');

// GET /cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: new mongoose.Types.ObjectId(req.user.userId)
        }).populate('items.product');

        // if cart not found create one and send it to client
        if (!cart) {
            const newCart = new Cart({ user: new mongoose.Types.ObjectId(req.user.userId) });
            await newCart.save();
            return res.status(200).json(await Cart.findOne({ user: new mongoose.Types.ObjectId(req.user.userId) }).populate('items.product'));
        }

        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// POST /cart
exports.createCart = async (req, res) => {
    try {
        const cart = new Cart({ user: new mongoose.Types.ObjectId(req.user.userId) });
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// POST /cart/items
exports.addItemToCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: new mongoose.Types.ObjectId(req.user.userId) });
        const item = cart.items.find(item => item.product == req.body._id);
        if (item) {
            item.quantity += req.body.quantity;
        } else {
            cart.items.push({ product: req.body._id, quantity: req.body.quantity });
        }
        await cart.save();
        res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

// PUT /cart/items/:id
exports.updateItemInCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: new mongoose.Types.ObjectId(req.user.userId) });
        const item = cart.items.find(item => item._id == req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        if (req.body.quantity) {
            item.quantity = req.body.quantity;
        }
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// DELETE /cart/items/:id
exports.deleteItemFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: new mongoose.Types.ObjectId(req.user.userId) });
        cart.items = cart.items.filter(item => item.product != req.params.id);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// DELETE /cart
exports.deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: new mongoose.Types.ObjectId(req.user.userId) });
        await cart.remove();
        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
// POST /cart/checkout
exports.checkoutCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: new mongoose.Types.ObjectId(req.user.userId) });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const items = req.body.cart.items;
  
      // Calculate the total order amount
      const totalAmount = calculateOrderAmount(items);
  
      // Create a Checkout Session
      const session = await stripe.checkout.sessions.create({
        success_url: `http://localhost:5173?success={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173?cancel`,
        line_items: items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
            },
            unit_amount: Math.round(item.product.price * 100), // Convert price to cents
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        phone_number_collection: {
            enabled: true,
        },
        allow_promotion_codes: true,
        shipping_address_collection: {
            allowed_countries: ['US'],
          },
          custom_text: {
            shipping_address: {
              message: 'Please note that we can\'t guarantee 2-day delivery for PO boxes at this time.',
            },
            submit: {
              message: 'We\'ll email you instructions on how to get started.',
            },
          },
      });
      
      // Clear the items in the cart
      cart.items.splice(0, cart.items.length);
  
      // Save the updated cart
      await cart.save();
  
      console.log(session);
      res.status(200).json({ clientSecret: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  function calculateOrderAmount(items) {
    // Calculate and return the total order amount based on items
    // You need to implement this based on your business logic
    let totalAmount = 0;
  
    items.forEach((item) => {
      // Ensure that item.product.price and item.quantity are valid numbers
      const price = parseFloat(item.product.price);
      const quantity = parseInt(item.quantity);
  
      if (!isNaN(price) && !isNaN(quantity)) {
        totalAmount += price * quantity;
      }
    });
  
    // Convert the totalAmount to cents
    return Math.round(totalAmount * 100);
  }
  