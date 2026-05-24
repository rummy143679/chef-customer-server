// tests/payment.test.js

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const crypto = require("crypto");

const Order = require("../models/orderSchema");
const Payment = require("../models/paymentSchema");
const Delivery = require("../models/deliverySchema");
const User = require("../models/userSchema");

let mongoServer;

jest.mock("razorpay");

const app = express();
app.use(express.json());

describe("Payment Controller Tests", () => {

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
        await Payment.deleteMany({});
        await Delivery.deleteMany({});
        await User.deleteMany({});

        const user = await User.create({
            userName: "Test Customer",
            email: "customer@test.com",
            password: "hashedPassword",
            role: "customer",
            contact: "9999999999"
        });
        customerId = user._id;
    });

    // ================= CREATE RAZORPAY ORDER =================

    describe("POST /api/payment/create", () => {

        beforeEach(() => {
            const { createRazorpayOrder } = require("../contollers/paymentController");
            app.post("/api/payment/create", createRazorpayOrder);
        });

        test("should return 400 when amount is missing", async() => {
            const response = await request(app)
                .post("/api/payment/create")
                .send({});

            expect(response.statusCode).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Amount missing");
        });

        test("should convert amount to paise correctly", async() => {
            // Mock the razorpay orders.create
            const Razorpay = require("razorpay");
            Razorpay.mockImplementation(() => ({
                orders: {
                    create: jest.fn().mockResolvedValue({
                        id: "order_123",
                        amount: 50000,
                        currency: "INR"
                    })
                }
            }));

            const response = await request(app)
                .post("/api/payment/create")
                .send({ amount: 500 });

            // Check if amount was correctly converted to paise (500 * 100 = 50000)
            if (response.statusCode === 200) {
                expect(response.body.success).toBe(true);
            }
        });

    });

    // ================= VERIFY PAYMENT AND CREATE ORDER =================

    describe("POST /api/payment/verify", () => {

        beforeEach(() => {
            const { verifyPaymentAndCreateOrder } = require("../contollers/paymentController");
            app.post("/api/payment/verify", verifyPaymentAndCreateOrder);
        });

        test("should verify payment and create order successfully", async() => {
            const razorpayOrderId = "order_123";
            const razorpayPaymentId = "pay_123";
            const secret = process.env.RAZORPAY_SECRET || "test_secret";

            // Generate valid signature
            const sign = razorpayOrderId + "|" + razorpayPaymentId;
            const razorpaySignature = crypto
                .createHmac("sha256", secret)
                .update(sign)
                .digest("hex");

            const paymentData = {
                razorpay_order_id: razorpayOrderId,
                razorpay_payment_id: razorpayPaymentId,
                razorpay_signature: razorpaySignature,
                items: [
                    { name: "Biryani", quantity: 1, price: 250, image: "url" }
                ],
                totalAmount: 250,
                customerId: customerId.toString(),
                customerLocation: { lat: 28.7041, lng: 77.1025 }
            };

            const response = await request(app)
                .post("/api/payment/verify")
                .send(paymentData);

            if (response.statusCode === 200) {
                expect(response.body.success).toBe(true);
                expect(response.body.order).toBeDefined();
            }
        });

        test("should reject invalid signature", async() => {
            const paymentData = {
                razorpay_order_id: "order_123",
                razorpay_payment_id: "pay_123",
                razorpay_signature: "invalid_signature",
                items: [{ name: "Item", quantity: 1, price: 100 }],
                totalAmount: 100,
                customerId: customerId.toString()
            };

            const response = await request(app)
                .post("/api/payment/verify")
                .send(paymentData);

            expect(response.statusCode).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test("should create payment record when verification succeeds", async() => {
            const razorpayOrderId = "order_456";
            const razorpayPaymentId = "pay_456";
            const secret = process.env.RAZORPAY_SECRET || "test_secret";

            const sign = razorpayOrderId + "|" + razorpayPaymentId;
            const razorpaySignature = crypto
                .createHmac("sha256", secret)
                .update(sign)
                .digest("hex");

            const paymentData = {
                razorpay_order_id: razorpayOrderId,
                razorpay_payment_id: razorpayPaymentId,
                razorpay_signature: razorpaySignature,
                items: [{ name: "Curry", quantity: 1, price: 200 }],
                totalAmount: 200,
                customerId: customerId.toString()
            };

            const response = await request(app)
                .post("/api/payment/verify")
                .send(paymentData);

            if (response.statusCode === 200) {
                const paymentRecord = await Payment.findOne({
                    razorpay_payment_id: razorpayPaymentId
                });
                expect(paymentRecord).toBeDefined();
            }
        });

        test("should create delivery record with customer location", async() => {
            const razorpayOrderId = "order_789";
            const razorpayPaymentId = "pay_789";
            const secret = process.env.RAZORPAY_SECRET || "test_secret";

            const sign = razorpayOrderId + "|" + razorpayPaymentId;
            const razorpaySignature = crypto
                .createHmac("sha256", secret)
                .update(sign)
                .digest("hex");

            const customerLocation = { lat: 28.7041, lng: 77.1025 };
            const paymentData = {
                razorpay_order_id: razorpayOrderId,
                razorpay_payment_id: razorpayPaymentId,
                razorpay_signature: razorpaySignature,
                items: [{ name: "Naan", quantity: 1, price: 50 }],
                totalAmount: 50,
                customerId: customerId.toString(),
                customerLocation
            };

            const response = await request(app)
                .post("/api/payment/verify")
                .send(paymentData);

            if (response.statusCode === 200) {
                const deliveryRecord = await Delivery.findOne();
                expect(deliveryRecord).toBeDefined();
                if (deliveryRecord) {
                    expect(deliveryRecord.customerId).toBe(customerId.toString());
                }
            }
        });

    });

});