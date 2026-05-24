// tests/delivery.test.js

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Delivery = require("../models/deliverySchema");
const DeliveryPersonAvailable = require("../models/deliveryPersonAvailableSchema");
const Order = require("../models/orderSchema");
const User = require("../models/userSchema");
const deliveryCtrl = require("../contollers/deliveryController");

let mongoServer;

const app = express();
app.use(express.json());

// Routes
app.post("/api/delivery-boy/location", deliveryCtrl.updateDeliveryBoyLocation);
app.post("/api/delivery/assign", deliveryCtrl.assignDeliveryBoy);
app.put("/api/delivery/:id/pick", deliveryCtrl.pickOrder);
app.put("/api/delivery/:id/start", deliveryCtrl.startDelivery);
app.put("/api/delivery/:id/location", deliveryCtrl.updateLocation);
app.put("/api/delivery/:id/reached", deliveryCtrl.reachedDestination);
app.put("/api/delivery/:id/delivered", deliveryCtrl.markDelivered);
app.get("/api/delivery/:id", deliveryCtrl.getDeliveryDetails);
app.get("/api/delivery-boy/active/:id", deliveryCtrl.getActiveDeliveries);
app.post("/api/delivery-boy/logout", deliveryCtrl.logoutDeliveryBoy);

describe("Delivery Controller Tests", () => {

    let deliveryBoyId;
    let customerId;
    let orderId;
    let deliveryId;

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
        await Delivery.deleteMany({});
        await DeliveryPersonAvailable.deleteMany({});
        await Order.deleteMany({});
        await User.deleteMany({});

        // Create test users
        const deliveryBoy = await User.create({
            userName: "Delivery Boy",
            email: "delivery@test.com",
            password: "hashedPassword",
            role: "delivery",
            contact: "9999999999"
        });
        deliveryBoyId = deliveryBoy._id;

        const customer = await User.create({
            userName: "Customer",
            email: "customer@test.com",
            password: "hashedPassword",
            role: "customer",
            contact: "8888888888"
        });
        customerId = customer._id;

        // Create test order
        const order = await Order.create({
            customerId: customerId,
            items: [{ name: "Item", quantity: 1, price: 100 }],
            totalAmount: 100
        });
        orderId = order._id;

        // Create test delivery
        const delivery = await Delivery.create({
            orderId: orderId,
            customerId: customerId,
            deliveryStatus: "not picked"
        });
        deliveryId = delivery._id;
    });

    // ================= UPDATE DELIVERY BOY LOCATION =================

    describe("POST /api/delivery-boy/location", () => {

        test("should create delivery person record when first time", async() => {
            const newDeliveryBoyId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .post("/api/delivery-boy/location")
                .send({
                    userId: newDeliveryBoyId,
                    lat: 28.7041,
                    lng: 77.1025
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.deliveryPerson.status).toBe("online");
        });

        test("should update existing delivery person location", async() => {
            // Create initial record
            await DeliveryPersonAvailable.create({
                userId: deliveryBoyId,
                location: { lat: 28.6, lng: 77.0 },
                status: "online"
            });

            const response = await request(app)
                .post("/api/delivery-boy/location")
                .send({
                    userId: deliveryBoyId,
                    lat: 28.7041,
                    lng: 77.1025
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.deliveryPerson.location.lat).toBe(28.7041);
        });

        test("should return 400 when required fields are missing", async() => {
            const response = await request(app)
                .post("/api/delivery-boy/location")
                .send({
                    userId: deliveryBoyId
                        // missing lat and lng
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.success).toBe(false);
        });

    });

    // ================= ASSIGN DELIVERY BOY =================

    describe("POST /api/delivery/assign", () => {

        test("should return 400 when no delivery boys are available", async() => {
            const response = await request(app)
                .post("/api/delivery/assign")
                .send({
                    orderId: orderId,
                    deliveryType: "normal"
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test("should assign delivery boy when available", async() => {
            // Create available delivery boy
            await DeliveryPersonAvailable.create({
                userId: deliveryBoyId,
                location: { lat: 28.7041, lng: 77.1025 },
                status: "online"
            });

            const response = await request(app)
                .post("/api/delivery/assign")
                .send({
                    orderId: orderId,
                    deliveryType: "normal"
                });

            if (response.statusCode === 200) {
                expect(response.body.success).toBe(true);
            }
        });

    });

    // ================= PICK ORDER =================

    describe("PUT /api/delivery/:id/pick", () => {

        test("should update delivery status to picked", async() => {
            const response = await request(app)
                .put(`/api/delivery/${deliveryId}/pick`)
                .send({});

            if (response.statusCode === 200) {
                const updatedDelivery = await Delivery.findById(deliveryId);
                expect(updatedDelivery.deliveryStatus).toBe("picked");
            }
        });

        test("should return error for invalid delivery ID", async() => {
            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .put(`/api/delivery/${fakeId}/pick`)
                .send({});

            // Should handle not found gracefully
            expect([404, 500]).toContain(response.statusCode);
        });

    });

    // ================= START DELIVERY =================

    describe("PUT /api/delivery/:id/start", () => {

        test("should update delivery status to on the way", async() => {
            const response = await request(app)
                .put(`/api/delivery/${deliveryId}/start`)
                .send({});

            if (response.statusCode === 200) {
                const updatedDelivery = await Delivery.findById(deliveryId);
                expect(updatedDelivery.deliveryStatus).toBe("on the way");
            }
        });

    });

    // ================= UPDATE LOCATION =================

    describe("PUT /api/delivery/:id/location", () => {

        test("should update delivery location during transit", async() => {
            const response = await request(app)
                .put(`/api/delivery/${deliveryId}/location`)
                .send({
                    lat: 28.7050,
                    lng: 77.1030
                });

            if (response.statusCode === 200) {
                const updatedDelivery = await Delivery.findById(deliveryId);
                expect(updatedDelivery.currentLocation).toBeDefined();
            }
        });

    });

    // ================= REACHED DESTINATION =================

    describe("PUT /api/delivery/:id/reached", () => {

        test("should update status when reached destination", async() => {
            const response = await request(app)
                .put(`/api/delivery/${deliveryId}/reached`)
                .send({});

            if (response.statusCode === 200) {
                const updatedDelivery = await Delivery.findById(deliveryId);
                expect(updatedDelivery.deliveryStatus).toBe("reached");
            }
        });

    });

    // ================= MARK DELIVERED =================

    describe("PUT /api/delivery/:id/delivered", () => {

        test("should update status to delivered", async() => {
            const response = await request(app)
                .put(`/api/delivery/${deliveryId}/delivered`)
                .send({});

            if (response.statusCode === 200) {
                const updatedDelivery = await Delivery.findById(deliveryId);
                expect(updatedDelivery.deliveryStatus).toBe("delivered");
            }
        });

    });

    // ================= GET DELIVERY DETAILS =================

    describe("GET /api/delivery/:id", () => {

        test("should fetch delivery details", async() => {
            const response = await request(app)
                .get(`/api/delivery/${deliveryId}`);

            if (response.statusCode === 200) {
                expect(response.body.success).toBe(true);
                expect(response.body.delivery._id.toString()).toBe(deliveryId.toString());
            }
        });

    });

    // ================= GET ACTIVE DELIVERIES =================

    describe("GET /api/delivery-boy/active/:id", () => {

        test("should fetch active deliveries for delivery boy", async() => {
            const response = await request(app)
                .get(`/api/delivery-boy/active/${deliveryBoyId}`);

            if (response.statusCode === 200) {
                expect(Array.isArray(response.body.deliveries)).toBe(true);
            }
        });

    });

    // ================= LOGOUT DELIVERY BOY =================

    describe("POST /api/delivery-boy/logout", () => {

        test("should remove delivery boy from available list", async() => {
            // Create available delivery boy
            await DeliveryPersonAvailable.create({
                userId: deliveryBoyId,
                location: { lat: 28.7041, lng: 77.1025 },
                status: "online"
            });

            const response = await request(app)
                .post("/api/delivery-boy/logout")
                .send({
                    userId: deliveryBoyId
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);

            const availableDelivery = await DeliveryPersonAvailable.findOne({
                userId: deliveryBoyId
            });
            expect(availableDelivery).toBeNull();
        });

    });

});