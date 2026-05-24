// tests/order.test.js

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Order = require("../models/orderSchema");
const User = require("../models/userSchema");
const { postOrders, getAllOrders } = require("../contollers/OrdersController");

let mongoServer;

const app = express();
app.use(express.json());

// Routes
app.post("/api/order", postOrders);
app.get("/api/orders/:id", getAllOrders);

describe("Order Controller Tests", () => {

    let customerId;

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
        await Order.deleteMany({});
        await User.deleteMany({});

        // Create a test user
        const user = await User.create({
            userName: "Test Customer",
            email: "customer@test.com",
            password: "hashedPassword",
            role: "customer",
            contact: "9999999999"
        });
        customerId = user._id;
    });

    // ================= POST ORDERS =================

    describe("POST /api/order", () => {

        test("should create an order successfully", async() => {
            const orderData = {
                items: [{
                        name: "Butter Chicken",
                        quantity: 1,
                        price: 250,
                        image: "https://example.com/butter-chicken.jpg"
                    },
                    {
                        name: "Naan",
                        quantity: 2,
                        price: 50,
                        image: "https://example.com/naan.jpg"
                    }
                ],
                totalAmount: 350,
                customerId: customerId.toString(),
                razorpay_order_id: "order_123",
                razorpay_payment_id: "pay_123",
                razorpay_signature: "sig_123"
            };

            const response = await request(app)
                .post("/api/order")
                .send(orderData);

            expect(response.statusCode).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.order.customerId).toBe(customerId.toString());
            expect(response.body.order.totalAmount).toBe(350);
            expect(response.body.order.paymentStatus).toBe("Paid");
            expect(response.body.order.makingStatus).toBe("not accepted");
            expect(response.body.order.deliveryStatus).toBe("not picked");
        });

        test("should create order with correct item count", async() => {
            const orderData = {
                items: [
                    { name: "Item 1", quantity: 1, price: 100 },
                    { name: "Item 2", quantity: 2, price: 150 },
                    { name: "Item 3", quantity: 1, price: 200 }
                ],
                totalAmount: 600,
                customerId: customerId.toString(),
                razorpay_order_id: "order_456",
                razorpay_payment_id: "pay_456",
                razorpay_signature: "sig_456"
            };

            const response = await request(app)
                .post("/api/order")
                .send(orderData);

            expect(response.statusCode).toBe(201);
            expect(response.body.order.items.length).toBe(3);
        });

        test("should set initial item status to 'not accepted'", async() => {
            const orderData = {
                items: [
                    { name: "Dish", quantity: 1, price: 100 }
                ],
                totalAmount: 100,
                customerId: customerId.toString(),
                razorpay_order_id: "order_789",
                razorpay_payment_id: "pay_789",
                razorpay_signature: "sig_789"
            };

            const response = await request(app)
                .post("/api/order")
                .send(orderData);

            expect(response.statusCode).toBe(201);
            expect(response.body.order.items[0].makingStatus).toBe("not accepted");
        });

        test("should handle missing required fields", async() => {
            const response = await request(app)
                .post("/api/order")
                .send({
                    customerId: customerId.toString()
                        // missing items and totalAmount
                });

            expect(response.statusCode).toBe(500);
        });

    });

    // ================= GET ALL ORDERS =================

    describe("GET /api/orders/:id", () => {

        test("should fetch current and old orders for customer", async() => {
            // Create current order (with incomplete items)
            await Order.create({
                customerId: customerId,
                items: [
                    { name: "Item 1", makingStatus: "not accepted" }
                ],
                totalAmount: 100
            });

            // Create old order (all items completed)
            await Order.create({
                customerId: customerId,
                items: [
                    { name: "Item 2", makingStatus: "completed" }
                ],
                totalAmount: 150
            });

            const response = await request(app)
                .get(`/api/orders/${customerId}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("success");
            expect(response.body.currentOrders.length).toBeGreaterThan(0);
            expect(response.body.oldOrders.length).toBeGreaterThan(0);
        });

        test("should return empty lists for customer with no orders", async() => {
            const newUser = await User.create({
                userName: "Another Customer",
                email: "another@test.com",
                password: "hashedPassword",
                role: "customer",
                contact: "8888888888"
            });

            const response = await request(app)
                .get(`/api/orders/${newUser._id}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.currentOrders.length).toBe(0);
            expect(response.body.oldOrders.length).toBe(0);
        });

        test("should separate current and completed orders", async() => {
            // Create order with mixed item statuses
            await Order.create({
                customerId: customerId,
                items: [
                    { name: "Item 1", makingStatus: "not accepted" },
                    { name: "Item 2", makingStatus: "completed" }
                ],
                totalAmount: 200
            });

            const response = await request(app)
                .get(`/api/orders/${customerId}`);

            expect(response.statusCode).toBe(200);
            // This order should be in currentOrders since not all items are completed
            expect(response.body.currentOrders.length).toBe(1);
        });

        test("should return 500 for invalid customer ID", async() => {
            const response = await request(app)
                .get("/api/orders/invalid-id");

            expect(response.statusCode).toBe(500);
        });

    });

});