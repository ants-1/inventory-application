const Category = require("../models/category");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name")
    .sort({ name: 1 })
    .exec();
  res.render("category_list", {
    title: "Categories",
    category_list: allCategories,
  });
});

// Display detail page for a specific Category
exports.category_detail = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).exec();

    if (!category) {
      const err = new Error("Category not found");
      err.status = 404;
      throw err;
    }

    const products = await Product.find({ categories: category._id }).exec();

    res.render("category_detail", {
      title: category.name,
      category: category,
      products: products,
    });
  } catch (err) {
    next(err);
  }
});

// Handle Category create form on GET
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

// Handle category create on POST
exports.category_create_post = [
  // Validate and sanitize the name field
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a Category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // Trhere are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(), 
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Catagory with same name already exists
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (categoryExists) {
        // Category exists, redirect to its detail page
        res.redirect(`/catalog/${categoryExists.url}`);
      } else {
        await category.save();
        // New Category saved. Redirect to Category detail page
        res.redirect(`/catalog/${category.url}`);
      }
    }
  }),
];

// Display Category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of Category and all their Products
  const [category, allProductsByCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ categories: req.params.id }).exec(),
  ]);

  if (category === null) {
    // No results
    res.redirect('/catalog/categories');
  }

  res.render('category_delete', {
    title: "Delete Category",
    category: category,
    category_products: allProductsByCategory,
  })
});

// Handle Category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    // Get details of Category and all their Products
    const [category, allProductsByCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Product.find({ categories: req.params.id }).exec(),
    ]);
  
    if (allProductsByCategory.length > 0) {
      // Category has Products. Render in same was as for GET route
      res.render('category_delete', {
        title: 'Delete Category',
        category: category,
        category_products: allProductsByCategory,
      });
      return;
    } else {
      // Category has no Products. Redirect to the list of categories
      await Category.findByIdAndDelete(req.body.categoryId);
      res.redirect('/catalog/categories');
      return;
    }
});

// Display Category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    // No results
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category_form', {
    title: 'Update Category',
    category: category,
  });
});

// Handle Category update on POST
exports.category_update_post = [
  // Validate and sanitize the name field
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description").trim().escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    const updatedCategory = {
      name: req.body.name,
      description: req.body.description,
    };

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Update Category",
        category: updatedCategory,
        errors: errors.array(), 
      });
      return;
    } else {
      // Data from form is valid. Update the record
      // Adding { new: true } returns the updated document
      await Category.findByIdAndUpdate(req.params.id, updatedCategory, { new: true }); // 
      res.redirect(`/catalog/category/${req.params.id}`);
    }
  }),
];

