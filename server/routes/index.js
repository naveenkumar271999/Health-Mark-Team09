const express = require('express');
const router = express.Router();

// user routes
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');

router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/cart', cartRoutes);

router.use('/', (req, res) => {
    res.json("You Shouldn't be here :)")
});

module.exports = router;