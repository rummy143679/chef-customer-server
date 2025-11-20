const express = require('express');
const Dish = require('../models/dishSchema');

// add new dish
const addNewDish = async (req, res) => {
  try {
    const existingDish = await Dish.findOne({ _id: req.body._id });
    if (existingDish) {
      await Dish.updateOne({ _id: req.body._id }, { $set: { ...req.body, available: req.body.available === "Yes" ? true : false } });
      return res.status(200).json({ message: "Dish updated successfully", dish: req.body });
    } else {
      const newDish = new Dish({
        ...req.body,
        available: req.body.available === "Yes" ? true : false
      });
      await newDish.save();
      res.status(201).json({ message: "Dish added successfully", dish: newDish });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add dish", error: error.message });
  }
};

// fetch dishes with pagination
const fetchDishes = async (req, res) => {
  const { currentPage, itemsPerPage } = req.query;
  try {
    const dishes = await Dish.find()
      .skip(parseInt((currentPage - 1) * itemsPerPage))
      .limit(parseInt(itemsPerPage));
    const total = await Dish.countDocuments();
    res.status(200).json({ status: "success", data: { dishes: dishes, total: total } });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch dishes", error: error.message });
  }
};

//delete dish
const deleteDish = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDish = await Dish.findByIdAndDelete(id);
    if (!deletedDish) {
      return res.status(404).json({ status: "error", message: "Dish not found" });
    }
    res.status(200).json({ status: "success", message: "Dish deleted successfully", dish: deletedDish });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to delete dish", error: error.message });
  }
};

//delete all dishes (for testing purposes)
const deleteAllDishes = async (req, res) => {
  try {
    await Dish.deleteMany({});
    return res.status(200).json({ status: "success", message: "All dishes deleted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Failed to delete all dishes", error: err.message });
  } finally {
    // mongoose.connection.close();
    console.log("Connection remains open for further operations.");
  }
}

//add all dishes (for testing purposes)

const dishes = [
  // VEG (10)
  {
    name: "Veg Biryani",
    description: "Aromatic basmati rice with vegetables",
    price: 9,
    available: true,
    category: "Veg",
    subCategory: "Rice",
    image: "https://images.unsplash.com/photo-1605478371371-3b6cc7e2a7e9"
  },
  {
    name: "Dal Tadka",
    description: "Yellow dal with garlic tempering",
    price: 7.99,
    available: true,
    category: "Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0"
  },
  {
    name: "Mushroom Masala",
    description: "Mushrooms cooked in tomato gravy",
    price: 11,
    available: true,
    category: "Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1604908177522-402da77919a3"
  },
  {
    name: "Kadai Paneer",
    description: "Spicy paneer with capsicum",
    price: 12,
    available: true,
    category: "Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
  },
  {
    name: "Paneer Butter Masala",
    description: "Rich and creamy paneer curry",
    price: 10,
    available: true,
    category: "Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1604908177520-1edc98b2e1f5"
  },
  {
    name: "Aloo Gobi",
    description: "Potatoes and cauliflower cooked in spices",
    price: 8,
    available: true,
    category: "Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1584270354949-1e59be9e4f8b"
  },
  {
    name: "Palak Paneer",
    description: "Paneer cooked in spinach gravy",
    price: 10,
    available: true,
    category: "Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1617196034620-2f9c6d1b1b59"
  },
  {
    name: "Veg Fried Rice",
    description: "Mixed vegetable fried rice",
    price: 6,
    available: true,
    category: "Veg",
    subCategory: "Rice",
    image: "https://images.unsplash.com/photo-1605478371371-3b6cc7e2a7e9"
  },
  {
    name: "Chole Bhature",
    description: "Spicy chickpeas with deep fried bread",
    price: 9,
    available: true,
    category: "Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1617196034620-2f9c6d1b1b59"
  },
  {
    name: "Vegetable Soup",
    description: "Healthy mixed vegetable soup",
    price: 5,
    available: true,
    category: "Veg",
    subCategory: "Soup",
    image: "https://images.unsplash.com/photo-1604908177522-402da77919a3"
  },

  // NON-VEG (10)
  {
    name: "Chicken Biryani",
    description: "Fragrant rice with marinated chicken",
    price: 14,
    available: true,
    category: "Non-Veg",
    subCategory: "Rice",
    image: "https://images.unsplash.com/photo-1627662056823-e4c8afbaf1a1"
  },
  {
    name: "Butter Chicken",
    description: "Creamy tomato chicken curry",
    price: 13,
    available: true,
    category: "Non-Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1626074689809-c6ee3e1c356c"
  },
  {
    name: "Grilled Chicken",
    description: "Roasted grilled chicken platter",
    price: 15,
    available: true,
    category: "Non-Veg",
    subCategory: "Tandoor",
    image: "https://images.unsplash.com/photo-1625948514699-d886a3040bd0"
  },
  {
    name: "Chicken Kebab",
    description: "Spicy grilled chicken skewers",
    price: 10,
    available: true,
    category: "Non-Veg",
    subCategory: "Tandoor",
    image: "https://images.unsplash.com/photo-1626074689809-c6ee3e1c356c"
  },
  {
    name: "Mutton Rogan Josh",
    description: "Slow cooked Kashmiri lamb curry",
    price: 18,
    available: true,
    category: "Non-Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
  },
  {
    name: "Fish Curry",
    description: "Spicy coastal fish curry",
    price: 14,
    available: true,
    category: "Non-Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1605478371371-3b6cc7e2a7e9"
  },
  {
    name: "Prawn Masala",
    description: "Prawns cooked in spicy gravy",
    price: 17,
    available: true,
    category: "Non-Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1604908177520-1edc98b2e1f5"
  },
  {
    name: "Chicken Curry",
    description: "Traditional Indian style curry",
    price: 12,
    available: true,
    category: "Non-Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
  },
  {
    name: "Chicken 65",
    description: "Spicy deep fried chicken bites",
    price: 9,
    available: true,
    category: "Non-Veg",
    subCategory: "Fried",
    image: "https://images.unsplash.com/photo-1626074689809-c6ee3e1c356c"
  },
  {
    name: "Egg Curry",
    description: "Boiled eggs cooked in onion-tomato gravy",
    price: 9,
    available: true,
    category: "Non-Veg",
    subCategory: "Curry",
    image: "https://images.unsplash.com/photo-1625948514699-d886a3040bd0"
  },

  // STARTERS (10)
  {
    name: "French Fries",
    description: "Crispy salted potato fries",
    price: 4,
    available: true,
    category: "Starter",
    subCategory: "Snack",
    image: "https://images.unsplash.com/photo-1601924582971-d3dc28b6bfa1"
  },
  {
    name: "Spring Rolls",
    description: "Fried rolls stuffed with vegetables",
    price: 6,
    available: true,
    category: "Starter",
    subCategory: "Snack",
    image: "https://images.unsplash.com/photo-1604908177522-402da77919a3"
  },
  {
    name: "Mozzarella Sticks",
    description: "Crispy fried cheese sticks",
    price: 7,
    available: true,
    category: "Starter",
    subCategory: "Fried",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
  },
  {
    name: "Paneer Tikka",
    description: "Char-grilled paneer cubes",
    price: 8,
    available: true,
    category: "Starter",
    subCategory: "Tandoor",
    image: "https://images.unsplash.com/photo-1605478371371-3b6cc7e2a7e9"
  },
  {
    name: "Veg Manchurian",
    description: "Veg dumplings in tangy sauce",
    price: 7,
    available: true,
    category: "Starter",
    subCategory: "Chinese",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0"
  },
  {
    name: "Chicken Nuggets",
    description: "Crispy fried chicken bites",
    price: 8,
    available: true,
    category: "Starter",
    subCategory: "Fried",
    image: "https://images.unsplash.com/photo-1604908177520-1edc98b2e1f5"
  },
  {
    name: "Chilli Chicken",
    description: "Spicy Indo-Chinese chicken",
    price: 10,
    available: false,
    category: "Starter",
    subCategory: "Chinese",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
  },
  {
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter",
    price: 5,
    available: true,
    category: "Starter",
    subCategory: "Bakery",
    image: "https://images.unsplash.com/photo-1605478371371-3b6cc7e2a7e9"
  },
  {
    name: "Crispy Corn",
    description: "Fried corn kernels seasoned with spices",
    price: 6,
    available: true,
    category: "Starter",
    subCategory: "Snack",
    image: "https://images.unsplash.com/photo-1604908177522-402da77919a3"
  },
  {
    name: "Chicken 65",
    description: "Spicy deep fried chicken bites",
    price: 9,
    available: true,
    category: "Starter",
    subCategory: "Fried",
    image: "https://images.unsplash.com/photo-1626074689809-c6ee3e1c356c"
  },

  // DRINKS (10)
  {
    name: "Fresh Lime Soda",
    description: "Lemon soda sweet or salted",
    price: 3,
    available: true,
    category: "Drink",
    subCategory: "Cold",
    image: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a"
  },
  {
    name: "Milkshake",
    description: "Thick milkshake of your choice",
    price: 5,
    available: true,
    category: "Drink",
    subCategory: "Cold",
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb26"
  },
  {
    name: "Mango Lassi",
    description: "Sweet yogurt mango drink",
    price: 4,
    available: true,
    category: "Drink",
    subCategory: "Cold",
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb26"
  },
  {
    name: "Cold Coffee",
    description: "Chilled coffee with ice and milk",
    price: 5,
    available: true,
    category: "Drink",
    subCategory: "Cold",
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb26"
  },
  {
    name: "Masala Chai",
    description: "Spiced Indian tea",
    price: 2,
    available: true,
    category: "Drink",
    subCategory: "Hot",
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb26"
  },
  {
    name: "Orange Juice",
    description: "Fresh squeezed orange juice",
    price: 4,
    available: false,
    category: "Drink",
    subCategory: "Cold",
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb26"
  },
  {
    name: "Water Bottle",
    description: "Packaged drinking water",
    price: 1,
    available: true,
    category: "Drink",
    subCategory: "Cold",
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb26"
  },
  {
    name: "Hot Coffee",
    description: "Brewed hot coffee",
    price: 3,
    available: true,
    category: "Drink",
    subCategory: "Hot",
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb26"
  },
  {
    name: "Coca Cola",
    description: "Chilled aerated drink",
    price: 2,
    available: true,
    category: "Drink",
    subCategory: "Cold",
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb26"
  },
  {
    name: "Iced Tea",
    description: "Cold tea with lemon",
    price: 4,
    available: true,
    category: "Drink",
    subCategory: "Cold",
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb26"
  },

  // DESSERTS (10)
  {
    name: "Gulab Jamun",
    description: "Sweet fried dumplings soaked in syrup",
    price: 5,
    available: true,
    category: "Dessert",
    subCategory: "Sweet",
    image: "https://images.unsplash.com/photo-1668235444753-246aa8f1e7ab"
  },
  {
    name: "Rasmalai",
    description: "Soft cheese balls in sweet milk",
    price: 7,
    available: false,
    category: "Dessert",
    subCategory: "Sweet",
    image: "https://images.unsplash.com/photo-1599785209797-df4b0f3a1fc4"
  },
  {
    name: "Cheesecake",
    description: "Baked creamy cheesecake slice",
    price: 8,
    available: true,
    category: "Dessert",
    subCategory: "Bakery",
    image: "https://images.unsplash.com/photo-1599785209797-df4b0f3a1fc4"
  },
  {
    name: "Fruit Salad",
    description: "Fresh mixed fruit bowl",
    price: 4,
    available: true,
    category: "Dessert",
    subCategory: "Healthy",
    image: "https://images.unsplash.com/photo-1599785209797-df4b0f3a1fc4"
  },
  {
    name: "Ice Cream Sundae",
    description: "Ice cream served with toppings",
    price: 6,
    available: true,
    category: "Dessert",
    subCategory: "Cold Sweet",
    image: "https://images.unsplash.com/photo-1599785209797-df4b0f3a1fc4"
  },
  {
    name: "Brownie",
    description: "Warm chocolate brownie",
    price: 6,
    available: true,
    category: "Dessert",
    subCategory: "Bakery",
    image: "https://images.unsplash.com/photo-1599785209797-df4b0f3a1fc4"
  },
  {
    name: "Ice Cream",
    description: "Scoop of your favorite flavor",
    price: 3,
    available: true,
    category: "Dessert",
    subCategory: "Cold Sweet",
    image: "https://images.unsplash.com/photo-1599785209797-df4b0f3a1fc4"
  },
  {
    name: "Kheer",
    description: "Indian rice pudding",
    price: 5,
    available: true,
    category: "Dessert",
    subCategory: "Sweet",
    image: "https://images.unsplash.com/photo-1599785209797-df4b0f3a1fc4"
  },
  {
    name: "Cupcake",
    description: "Small individual flavored cake",
    price: 4,
    available: true,
    category: "Dessert",
    subCategory: "Bakery",
    image: "https://images.unsplash.com/photo-1599785209797-df4b0f3a1fc4"
  },
  {
    name: "Chocolate Mousse",
    description: "Fluffy chocolate cream dessert",
    price: 7,
    available: true,
    category: "Dessert",
    subCategory: "Sweet",
    image: "https://images.unsplash.com/photo-1599785209797-df4b0f3a1fc4"
  }
];


const addAllDishes = async (req, res) => {
  try {
    await Dish.insertMany(dishes);
    // console.log(req.body)
    return res.status(200).json({ status: "success", message: "All dishes added successfully!" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Failed to add all dishes", error: err.message });
  } finally {
    // mongoose.connection.close();
    console.log("Connection remains open for further operations.");
  }
}

module.exports = { addNewDish, fetchDishes, deleteDish, deleteAllDishes, addAllDishes };