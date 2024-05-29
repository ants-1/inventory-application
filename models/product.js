const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String,  required: true, maxLength: 100 },
    description: { type: String, maxLength: 250 },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
    price: { type: Number, min: 0, required: true },
    quantity: { type: Number, min: 0, requried: true },
});

// Virtual for product's URL
ProductSchema.virtual('url').get(function () {
    return `/product/${this._id}`;
})


module.exports = mongoose.model("Product", ProductSchema);