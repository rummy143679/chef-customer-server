const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Dish_Schema = new Schema({
//   id: "unique-id-or-auto-generated",
  name: {type : String, required: true},
  description: {type : String, required: true},
  price: {type : Number, required: true}, // number (not string)
  available: {type : Boolean, required: true}, // true = in stock, false = out of stock

  category: {type : String, required: true}, // High level menu category
  subCategory: {type : String, required: true}, // Optional classification (Veg / Non-Veg / Vegan / etc.)

  imageUrl: {type : String, required: true}, // optional thumbnail
  
  // ✅ Optional but recommended for restaurant UI
  spiceLevel: {type : Number, required: true}, // 0 = no spice, up to 5 = very spicy
  isChefSpecial: {type : Boolean, required: true}, // highlight star dishes
  preparationTime: {type : String, required: true}, // in minutes (used in kitchen / order tracking)
  rating: {type : Number, required: true}, // user feedback rating
})

const DishSchema = mongoose.model("Dishes", Dish_Schema)

module.exports = {DishSchema};