const Product = require('../models/product');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Site Home Page');
});

// Display list of all Products
exports.product_list = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Product list');
});

// Display detail page for a specific Product
exports.product_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Product detail: ${req.params.id}`);
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