// tests/dish.test.js

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Dish = require("../models/dishSchema");
const { addNewDish, fetchDishes, deleteDish } = require("../contollers/dishController");

let mongoServer;

const app = express();
app.use(express.json());

// Routes
app.post("/api/add-dish", addNewDish);
app.get("/api/dishes", fetchDishes);
app.delete("/api/delete-dish/:id", deleteDish);

describe("Dish Controller Tests", () => {

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

    // ================= ADD DISH =================

    describe("POST /api/add-dish", () => {

        test("should add a new dish successfully", async() => {
            const dishData = {
                name: "Butter Chicken",
                description: "Creamy tomato-based curry",
                price: 250,
                available: "Yes",
                category: "Non-Veg",
                subCategory: "Curry",
                image: "https://example.com/butter-chicken.jpg"
            };

            const response = await request(app)
                .post("/api/add-dish")
                .send(dishData);

            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe("Dish added successfully");
            expect(response.body.dish.name).toBe("Butter Chicken");
            expect(response.body.dish.available).toBe(true);
        });

        test("should update an existing dish", async() => {
            const dish = await Dish.create({
                name: "Dal Makhani",
                price: 200,
                available: true,
                category: "Veg",
                description: "Creamy dal"
            });

            const updateData = {
                _id: dish._id,
                name: "Dal Makhani",
                description: "Updated creamy dal",
                price: 220,
                available: "Yes",
                category: "Veg"
            };

            const response = await request(app)
                .post("/api/add-dish")
                .send(updateData);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe("Dish updated successfully");
        });

        test("should handle missing required fields", async() => {
            const response = await request(app)
                .post("/api/add-dish")
                .send({
                    name: "Incomplete Dish"
                });

            expect(response.statusCode).toBe(500);
        });

        test("should convert 'Yes' to true for available field", async() => {
            const dishData = {
                name: "Samosa",
                price: 50,
                available: "Yes",
                category: "Veg",
                description: "Crispy samosa"
            };

            const response = await request(app)
                .post("/api/add-dish")
                .send(dishData);

            expect(response.statusCode).toBe(201);
            expect(response.body.dish.available).toBe(true);
        });

    });

    // ================= FETCH DISHES =================

    describe("GET /api/dishes", () => {

        test("should fetch dishes with pagination", async() => {
            // Create test dishes
            await Dish.create([{
                    name: "Dish 1",
                    price: 100,
                    available: true,
                    category: "Veg"
                },
                {
                    name: "Dish 2",
                    price: 150,
                    available: true,
                    category: "Non-Veg"
                },
                {
                    name: "Dish 3",
                    price: 200,
                    available: false,
                    category: "Veg"
                }
            ]);

            const response = await request(app)
                .get("/api/dishes")
                .query({ currentPage: 1, itemsPerPage: 10 });

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("success");
            expect(response.body.data.dishes.length).toBe(3);
            expect(response.body.data.total).toBe(3);
        });

        test("should return empty list when no dishes exist", async() => {
            const response = await request(app)
                .get("/api/dishes")
                .query({ currentPage: 1, itemsPerPage: 10 });

            expect(response.statusCode).toBe(200);
            expect(response.body.data.dishes.length).toBe(0);
            expect(response.body.data.total).toBe(0);
        });

        test("should paginate results correctly", async() => {
            // Create 15 dishes
            const dishes = Array.from({ length: 15 }, (_, i) => ({
                name: `Dish ${i + 1}`,
                price: 100 + i * 10,
                available: true,
                category: "Veg"
            }));
            await Dish.create(dishes);

            const response = await request(app)
                .get("/api/dishes")
                .query({ currentPage: 2, itemsPerPage: 5 });

            expect(response.statusCode).toBe(200);
            expect(response.body.data.dishes.length).toBe(5);
            expect(response.body.data.total).toBe(15);
        });

    });

    // ================= DELETE DISH =================

    describe("DELETE /api/delete-dish/:id", () => {

        test("should delete a dish successfully", async() => {
            const dish = await Dish.create({
                name: "Dish to Delete",
                price: 100,
                available: true,
                category: "Veg"
            });

            const response = await request(app)
                .delete(`/api/delete-dish/${dish._id}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("success");
            expect(response.body.message).toBe("Dish deleted successfully");

            const deletedDish = await Dish.findById(dish._id);
            expect(deletedDish).toBeNull();
        });

        test("should return 404 when dish not found", async() => {
            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .delete(`/api/delete-dish/${fakeId}`);

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Dish not found");
        });

        test("should return 500 for invalid ID format", async() => {
            const response = await request(app)
                .delete("/api/delete-dish/invalid-id");

            expect(response.statusCode).toBe(500);
        });

    });

});