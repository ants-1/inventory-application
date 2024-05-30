const Product = require('../models/product');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
    res.render('index', { title: 'Home' });
});

// Display list of all Products
exports.product_list = asyncHandler(async (req, res, next) => {
    const allProducts = await Product.find({}, "name").sort({ name: 1 }).exec();
    res.render('product_list', { title: 'Products', product_list: allProducts });
});

// Display detail page for a specific Product
exports.product_detail = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('categories').exec();

    if (!product) {
        // Product not found
        const err = new Error('Product not found');
        err.status = 404;
        return next(err);
    } else if (!product.name) {
        const err = new Error('Product name not found');
        err.status = 404;
        return next(err);
    }

    res.render('product_detail', { title: product.name, product: product });
});

// Display Product create form on GET
exports.product_create_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Product create GET');
});

// Handle Product create on POST
exports.product_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Product create POST');
});

// Display Product delete form on GET
exports.product_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Product delete GET');
});

// Handler Product delete on POST
exports.product_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Product delete POST');
});

// Display Product update form on GET
exports.product_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Product update GET');
});

// Handler Proudct update on POST
exports.product_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Product update POST');
});