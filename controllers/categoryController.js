const Category = require('../models/category');
const Product = require('../models/product');
const asyncHandler = require('express-async-handler');

// Display list of all Categories
exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, 'name').sort({ name: 1 }).exec();
    res.render('category_list', { title: 'Categories', category_list: allCategories });
});

// Display detail page for a specific Category
exports.category_detail = asyncHandler(async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id).exec();
        
        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            throw err;
        }

        const products = await Product.find({ categories: category._id }).exec();

        res.render('category_detail', { title: category.name, category: category, products: products });
    } catch (err) {
        next(err);
    }
});

// Handle Category create form on GET
exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category create GET');
});

// Handle category create on POST
exports.category_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category create POST');
});

// Display Category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category delete GET');
});

// Handle Category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Cateogry delete POST');
});

// Display Category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category update GET');
});

// Handle Category update on POST
exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.sent('NOT IMPLEMENTED: Category update POST');
})