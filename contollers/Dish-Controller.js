const express = require('express');
const { DishSchema } = require('../models/Dish-Schema');

//insert one db.dish.insertOne(object);
const insertOneDish = async (req, res) => {
    try {
        const dish = new DishSchema({
            // id: "unique-id-or-auto-generated",
            name: "Vodka with jin",
            description: "Chef specially made",
            price: 11.00, // number (not string)
            available: true, // true = in stock, false = out of stock

            category: "Beverage", // High level menu category
            subCategory: "Hot-Drink", // Optional classification (Veg / Non-Veg / Vegan / etc.)

            imageUrl: "https://example.com/images/margherita.jpg", // optional thumbnail

            // ✅ Optional but recommended for restaurant UI
            spiceLevel: 0, // 0 = no spice, up to 5 = very spicy
            isChefSpecial: true, // highlight star dishes
            preparationTime: 10, // in minutes (used in kitchen / order tracking)
            rating: 5, // user feedback rating
        });

        const dbRes = await dish.save();

        return res.status(201).json({ status: "success", message: dbRes });

    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message });
    }
}

// insert meny 
const insertMenyDish = async (req, res) => {
    try {
        const dishes = req.body
        // console.log(dishes);
        const dbRes = await DishSchema.insertMany(dishes);

        return res.status(201).json({ status: "success", message: dbRes });
        // return res.status(201).json({ status: "success" });

    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message });
    }
}


// find one by name
const dishByName = async (req, res) => {
    try {
        const dish = await DishSchema.find({ name: { $eq: req.params.name } });
        return res.status(200).json({ status: "success", data: dish });
    } catch (e) {
        return res.status(500).json({ status: 'error', message: e.message });
    }
}

// find all and count
const findAllDishes = async (req, res) => {
    try {
        const dish = await DishSchema.find();
        const total = await DishSchema.aggregate([
            { $count: "total" }
        ])
        return res.status(200).json({ status: "success", dish, total });
    } catch (e) {
        return res.status(500).json({ status: 'error', message: e.message });
    }
}

// only with requires fields not all fields
const withRequiredFields = async (req, res) => {
    try {
        const dish = await DishSchema.find({ available: false }, { name: 1, price: 1, available: 1 })
        return res.status(200).json({ status: "success", dish });
    } catch (e) {
        return res.status(500).json({ status: 'error', message: e.message });
    }
}

// update one
const updateOneDish = async (req, res) => {
    try {
        const updatedDish = await DishSchema.updateOne({ name: req.params.name }, { $set: { price: req.body.price, available: req.body.available } })
        return res.status(200).json({ status: "success", updatedDish });
    } catch (e) {
        return res.status(500).json({ status: 'error', message: e.message });
    }
}

//update-meny
const updateManyDish = async (req, res) => {
    try {
        const updatedDishes = await DishSchema.updateMany({ available: false }, { $set: { price: parseInt(req.body.price), available: req.body.available } })
        return res.status(200).json({ status: "success", updatedDishes });
    } catch (e) {
        return res.status(500).json({ status: 'error', message: e.message });
    }
}

// delete one
const deleteOneDish = async (req, res) => {
    try {
        const deleteDishes = await DishSchema.deleteOne({ _id: req.params.id });
        return res.status(200).json({ status: "success", deleteDishes });
    } catch (e) {
        return res.status(500).json({ status: 'error', message: e.message });
    }
}

//delete many by 
const deleteManyDishes = async (req, res) => {
    try {
        const deletedDishes = await DishSchema.deleteMany({ available: req.body.available });
        return res.status(200).json({ status: "success", deletedDishes });
    } catch (e) {
        return res.status(500).json({ status: 'error', message: e.message });
    }
}

// conditional  opraters

// - **Comparison Operators:** These operators compare the values of fields in documents.
//     - `$eq`: Matches values that are equal to a specified value.
//     - `$ne`: Matches values that are not equal to a specified value.
//     - `$gt`: Matches values that are greater than a specified value.
//     - `$gte`: Matches values that are greater than or equal to a specified value.
//     - `$lt`: Matches values that are less than a specified value.
//     - `$lte`: Matches values that are less than or equal to a specified value.


// - **Logical Operators:** These operators combine multiple conditions.
//     - `$and`: Joins query clauses with a logical AND and returns all documents that match the conditions.
//     - `$or`: Joins query clauses with a logical OR and returns all documents that match any of the conditions.
//     - `$not`: Inverts the effect of a query expression and returns documents that do not match the query expression.

// **Aggregation Stages:**

// The aggregation framework consists of various stages, each performing a specific operation on the input documents and passing the results to the next stage. Some common stages include:

// 1. **$match**: Filters documents based on specified criteria.
// get by category
const getByCategory = async (req, res) => {
    try {
        const category = await DishSchema.aggregate([
            { $match: { category: req.params.category } }
        ]);
        return res.status(200).json({ status: "success", category });
    } catch (e) {
        return res.status(500).json({ status: 'error', message: e.message });
    }
}

// get by price trange
// /resource/:id  --  paramsa req.params.id
// /resource?key=value&key2=value2  -- query  req.query.key1, req.query.key2
const getByPriceRange = async (req, res) => {
    try {
        // const {start, end} = req.query;
        // console.log(req.query.end)
        const pricesRange = await DishSchema.aggregate([
            { $match: { price: {$gte: Number(req.query.start), $lte: Number(req.query.end)} } }
        ]);
        return res.status(200).json({ status: "success", pricesRange });
    } catch (e) {
        return res.status(500).json({ status: 'error', message: e.message });
    }
}

const getByCategoryAndRating = async (req, res) => {
    try {
        const byCategoryAndRating = await DishSchema.aggregate([
            { $match: { $and: [{category: req.query.category},{rating: {$gte: req.query.rating}}]} }
        ]);
        return res.status(200).json({ status: "success", byCategoryAndRating });
    } catch (e) {
        return res.status(500).json({ status: 'error', message: e.message });
    }
}



// 2. **$group**: Groups documents by a specified expression and applies accumulator expressions to calculate computed values for each group.
// 3. **$project**: Reshapes documents, includes, excludes, or transforms fields, and calculates new expressions.
// 4. **$sort**: Orders the documents.
// 5. **$limit**: Limits the number of documents passed to the next stage.
// 6. **$skip**: Skips a specified number of documents.
// 7. **$unwind**: Deconstructs an array field from input documents and outputs a document for each element in the array.


// ### **Aggregation Operators:**

// MongoDB provides a variety of aggregation operators to perform computations within the aggregation pipeline. Some common aggregation operators include:

// - **$sum**: Calculates the sum of numeric values.
// - **$avg**: Calculates the average of numeric values.
// - **$min**: Finds the minimum value.
// - **$max**: Finds the maximum value.
// - **$push**: Appends values to an array.
// - **$addToSet**: Adds unique values to an array.
// - **$project**: Reshapes documents by including, excluding, or transforming fields.
// - **$group**: Groups documents by a specified expression and applies accumulator expressions to calculate computed values for each group.

module.exports = { getByCategoryAndRating, getByPriceRange, getByCategory, insertOneDish, dishByName, findAllDishes, insertMenyDish, withRequiredFields, updateOneDish, updateManyDish, deleteOneDish, deleteManyDishes };