const express = require('express');
const router = express.Router();

const productController = require('../../controllers/productController');
const authenticate = require('../../middleware/authenticate');

router.post('/', authenticate, productController.createProduct);
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);
router.get('/', authenticate, productController.getAllProduct);
router.get('/:id', authenticate, productController.getSingleProduct);
router.get('/category/:category', authenticate, productController.getProductByCategory);
router.get('/vendor/:vendorID', authenticate, productController.getProductByVendor);
router.get('/price/:price', authenticate, productController.getProductByPrice);
router.get('/name/:name', authenticate, productController.getProductByName);
router.get('/id/:id', authenticate, productController.getProductById);

module.exports = router;
