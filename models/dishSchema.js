const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  image: { type: String, required: true },
  spiceLevel: { type: Number, min: 0, max: 5 },
  isChefSpecial: { type: Boolean, default: false },
  preparationTime: { type: Number }, // in minutes
  rating: { type: Number, min: 0, max: 5 },
}, { timestamps: true });

const Dish = mongoose.model('Dish', dishSchema);
module.exports = Dish;
