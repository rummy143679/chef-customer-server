const { json } = require('express');
const Dish = require('../models/dishSchema');


const getTopItemsFromEachCategory = async (req, res) => {
    try {
        const topItems = await Dish.aggregate([
            { $sort: { catrgory: 1, price: -1 } }, // Sort by category and then by price descending
            {
                $group: {
                    _id: "$category",
                    topDish: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$topDish" }
            }

        ])
        return res.status(200).json({ status: "success", data: topItems })
    } catch (e) {
        return res.status(500).json({ staus: "error", message: e.message });
    }
}

const getTopRated = async (req, res) => {
    try {
        const topRated = await Dish.aggregate([
            // Sort by category and rating (high → low)
            { $sort: { category: 1, rating: -1 } },

            // Group by category
            {
                $group: {
                    _id: "$category",
                    topDishes: { $push: "$$ROOT" }
                }
            },

            // Take only top 2 dishes per category
            {
                $project: {
                    _id: 0,
                    topDishes: { $slice: ["$topDishes", 2] }
                }
            },

            // Flatten array
            { $unwind: "$topDishes" },

            // Convert object structure
            { $replaceRoot: { newRoot: "$topDishes" } }
        ]);
        return res.status(200).json({ status: "success", data: topRated })
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ status: "error", message: e.message });
    }
}

const getDishesByCategory = async (req, res) => {
    try {
        const grouped = await Dish.aggregate([
            {
                $group: {
                    _id: "$category",
                    dishes: { $push: "$$ROOT" }
                }
            }
        ]);

        // Transform to desired format [{ Veg: [...] }, { Non-Veg: [...] }]
        const result = grouped.map(g => ({ [g._id]: g.dishes }));
        return res.status(200).json({ status: "success", data: result });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


module.exports = { getTopItemsFromEachCategory, getTopRated, getDishesByCategory }