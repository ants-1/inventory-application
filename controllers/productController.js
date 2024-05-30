const Product = require('../models/product');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

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
    const allCategories = await Category.find().sort({ name: 1 }).exec();

    res.render('product_form', {
        title: 'Create Product',
        categories: allCategories,
    });
});

// Handle Product create on POST
exports.product_create_post = [
    // Convert the category to an array
    (req, res, next) => {
        if (!Array.isArray(req.body.category)) {
            req.body.category = typeof req.body.category === 'undefined' ? [] : [req.body.category];
        }
        next();
    },

    // Validate and sanitize fields
    body('name', 'Product name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('category', 'Category must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('quantity', 'Quantity must not be empty.').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create Product object with escaped and trimmed data
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            categories: req.body.category,
            price: req.body.price,
            quantity: req.body.quantity,
        });

        if (!errors.isEmpty()) {
            // There are error.s Render form again with sanitized values/error messages
            const allCategories = await Category.find().sort({ name: 1 }).exec();

            // Mark selected Categories as checked
            for (const category of allCategories) {
                if (product.category.includes(category._id)) {
                    category.checked = "true";
                }
            }

            res.render('product_form', {
                title: 'Create Product',
                categories: allCategories,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Save Product
            await product.save();
            res.redirect(`/catalog/${product.url}`);
        }
    })
];

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