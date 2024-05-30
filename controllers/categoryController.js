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
  res.send("NOT IMPLEMENTED: Category delete GET");
});

// Handle Category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Cateogry delete POST");
});

// Display Category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update GET");
});

// Handle Category update on POST
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.sent("NOT IMPLEMENTED: Category update POST");
});
