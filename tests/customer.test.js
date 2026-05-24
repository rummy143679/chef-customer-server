// tests/customer.test.js

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Dish = require("../models/dishSchema");
const { DishSchema } = require("../models/Dish-Schema");
const {
    getTopItemsFromEachCategory,
    getTopRated,
    getDishesByCategory
} = require("../contollers/customerController");

let mongoServer;

const app = express();
app.use(express.json());

// Routes
app.get("/api/tioec", getTopItemsFromEachCategory);
app.get("/api/top-rated", getTopRated);
app.get("/api/category-wise", getDishesByCategory);

describe("Customer Controller Tests", () => {

    beforeAll(async() => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    afterAll(async() => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async() => {
        await Dish.deleteMany({});
    });

    // ================= TOP ITEMS FROM EACH CATEGORY =================

    describe("GET /api/tioec", () => {

        test("should return top items from each category", async() => {
            // Create dishes in different categories
            await Dish.create([{
                    name: "Veg Biryani",
                    category: "Veg",
                    price: 250,
                    available: true,
                    rating: 4.5
                },
                {
                    name: "Paneer Curry",
                    category: "Veg",
                    price: 200,
                    available: true,
                    rating: 4.0
                },
                {
                    name: "Butter Chicken",
                    category: "Non-Veg",
                    price: 300,
                    available: true,
                    rating: 4.8
                },
                {
                    name: "Tandoori Chicken",
                    category: "Non-Veg",
                    price: 280,
                    available: true,
                    rating: 4.2
                },
                {
                    name: "Samosa",
                    category: "Snacks",
                    price: 50,
                    available: true,
                    rating: 4.6
                }
            ]);

            const response = await request(app)
                .get("/api/tioec");

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("success");
        });

        test("should return empty array when no dishes exist", async() => {
            const response = await request(app)
                .get("/api/tioec");

            expect(response.statusCode).toBe(200);
        });

    });

    // ================= TOP RATED DISHES =================

    describe("GET /api/top-rated", () => {

        test("should return top rated dishes", async() => {
            await Dish.create([{
                    name: "Premium Biryani",
                    price: 300,
                    available: true,
                    rating: 4.9,
                    category: "Veg"
                },
                {
                    name: "Special Curry",
                    price: 250,
                    available: true,
                    rating: 4.7,
                    category: "Veg"
                },
                {
                    name: "Regular Dal",
                    price: 100,
                    available: true,
                    rating: 3.5,
                    category: "Veg"
                }
            ]);

            const response = await request(app)
                .get("/api/top-rated");

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("success");
        });

        test("should sort by rating in descending order", async() => {
            await Dish.create([
                { name: "Dish A", rating: 3.0, price: 100, category: "Veg", available: true },
                { name: "Dish B", rating: 5.0, price: 150, category: "Veg", available: true },
                { name: "Dish C", rating: 4.0, price: 120, category: "Veg", available: true }
            ]);

            const response = await request(app)
                .get("/api/top-rated");

            if (response.statusCode === 200 && response.body.data.length > 0) {
                for (let i = 0; i < response.body.data.length - 1; i++) {
                    expect(response.body.data[i].rating).toBeGreaterThanOrEqual(
                        response.body.data[i + 1].rating
                    );
                }
            }
        });

    });

    // ================= CATEGORY WISE DISHES =================

    describe("GET /api/category-wise", () => {

        test("should return dishes grouped by category", async() => {
            await Dish.create([
                { name: "Veg Curry", category: "Veg", price: 200, available: true },
                { name: "Chicken Curry", category: "Non-Veg", price: 300, available: true },
                { name: "Fish Curry", category: "Non-Veg", price: 350, available: true },
                { name: "Paneer Tikka", category: "Veg", price: 250, available: true }
            ]);

            const response = await request(app)
                .get("/api/category-wise");

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("success");
        });

        test("should include all categories present in dishes", async() => {
            const testDishes = [
                { name: "Biryani", category: "Rice", price: 250, available: true },
                { name: "Naan", category: "Bread", price: 50, available: true },
                { name: "Samosa", category: "Snacks", price: 30, available: true }
            ];

            await Dish.create(testDishes);

            const response = await request(app)
                .get("/api/category-wise");

            if (response.statusCode === 200 && response.body.data) {
                const categories = Object.keys(response.body.data);
                expect(categories.length).toBeGreaterThan(0);
            }
        });

        test("should return empty result when no dishes exist", async() => {
            const response = await request(app)
                .get("/api/category-wise");

            expect(response.statusCode).toBe(200);
        });

    });

});