#!/usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require("./models/product");
const Category = require("./models/category");

const products = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");

  await createCategories();
  await createProducts(categories);

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function productCreate(
  index,
  name,
  description,
  categories,
  price,
  quantity
) {
  const productDetails = {
    name: name,
    description: description,
    categories: categories,
    price: price,
    quantity: quantity,
  };

  const product = new Product(productDetails);

  await product.save();
  products[index] = product;
  console.log(`Added product: ${name}`);
}

async function categoryCreate(index, name, description) {
  const categoryDetails = {
    name: name,
    description: description,
  };

  const category = new Category(categoryDetails);

  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function createProducts(categories) {
  console.log("Adding products");
  await Promise.all([
    productCreate(
      0,
      "The Legend of Zelda: Breath of the Wild",
      "An open-world action-adventure game where players explore the kingdom of Hyrule.",
      [categories[0]._id, categories[1]._id],
      59.99,
      120
    ),
    productCreate(
      1,
      "Final Fantasy VII Remake",
      "A modern retelling of the classic RPG with enhanced graphics and gameplay.",
      [categories[2]._id, categories[3]._id],
      69.99,
      85
    ),
    productCreate(
      2,
      "Call of Duty: Modern Warfare",
      "A realistic first-person shooter game with intense multiplayer action.",
      [categories[4]._id],
      49.99,
      200
    ),
    productCreate(
      3,
      "FIFA 22",
      "The latest installment in the FIFA series with updated teams and improved gameplay mechanics.",
      [categories[5]._id],
      59.99,
      150
    ),
    productCreate(
      4,
      "Tetris Effect",
      "A mesmerizing puzzle game that combines classic Tetris gameplay with stunning visuals and music.",
      [categories[6]._id],
      29.99,
      300
    ),
    productCreate(
      5,
      "Hades",
      "An action-packed rogue-like game where you battle your way out of the Underworld.",
      [categories[7]._id],
      24.99,
      400
    ),
  ]);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Action", "Action games emphasize physical challenges."),
    categoryCreate(
      1,
      "Adventure",
      "Adventure games focus on puzzle-solving within a narrative framework."
    ),
    categoryCreate(
      2,
      "RPG",
      "Role-playing games involve character development and story progression."
    ),
    categoryCreate(
      3,
      "Fantasy",
      "Fantasy games are set in fictional universes with magical elements."
    ),
    categoryCreate(
      4,
      "Shooter",
      "Shooter games test the player’s aim and reaction time."
    ),
    categoryCreate(
      5,
      "Sports",
      "Sports games simulate the practice of sports."
    ),
    categoryCreate(
      6,
      "Puzzle",
      "Puzzle games challenge the player’s problem-solving skills."
    ),
    categoryCreate(
      7,
      "Indie",
      "Indie games are created by independent developers."
    ),
  ]);
}
