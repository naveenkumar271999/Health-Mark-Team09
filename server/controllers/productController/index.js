const Product = require('../../models/productModel');

// create product
exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(200).json({ message: 'Product created successfully', product: savedProduct });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


// update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (req.body.name) {
            product.name = req.body.name;
        }
        if (req.body.description) {
            product.description = req.body.description;
        }
        if (req.body.price) {
            product.price = req.body.price;
        }
        if (req.body.units) {
            product.units = req.body.units;
        }
        if (req.body.category) {
            product.category = req.body.category;
        }
        if (req.body.vendorID) {
            product.vendorID = req.body.vendorID;
        }
        await product.save();
        res.status(200).json({ product: product, message: 'Product updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

// get all product
exports.getAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// get single product
exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// get product by category
exports.getProductByCategory = async (req, res) => {
    try{
        const products = await Product.find({ category: req.params.category });
        res.status(200).json({ products });
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}

// get product by vendor
exports.getProductByVendor = async (req, res) => {
    try{
        const products = await Product.find({ vendorID: req.params.vendorID });
        res.status(200).json({ products });
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}

// get product by price
exports.getProductByPrice = async (req, res) => {
    try{
        const products = await Product.find({ price: req.params.price });
        res.status(200).json({ products });
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}

// get product by name
exports.getProductByName = async (req, res) => {
    try{
        const products = await Product.find({ name: req.params.name });
        res.status(200).json({ products });
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}

// get product by id
exports.getProductById = async (req, res) => {
    try{
        const products = await Product.find({ _id: req.params.id });
        res.status(200).json({ products });
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}
