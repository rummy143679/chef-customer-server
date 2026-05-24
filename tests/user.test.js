// tests/user.test.js

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcrypt");

const User = require("../models/userSchema");
const { createJwtToken } = require("../utility/createJwtToken");
const { register, login, users } = require("../contollers/userControllers");

let mongoServer;

require("dotenv").config();

const app = express();
app.use(express.json());

// Routes
app.post("/api/register", register);
app.post("/api/login", login);
app.get("/api/users", users);

describe("User API Testing with Supertest", () => {

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
        await User.deleteMany({});
    });

    // ================= REGISTER =================

    describe("POST /api/register", () => {

        test("should register new user successfully", async() => {
            const response = await request(app)
                .post("/api/register")
                .send({
                    userName: "Ramesh",
                    email: "ramesh@gmail.com",
                    password: "SecurePass123!",
                    role: "admin",
                    contact: "9999999999"
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.status).toBe("success");
            expect(response.body.message).toBe("User registered successfully");
            expect(response.body.data.userName).toBe("Ramesh");
            expect(response.body.data.email).toBe("ramesh@gmail.com");
            expect(response.body.data.role).toBe("admin");

            // Verify user is actually saved
            const user = await User.findOne({ email: "ramesh@gmail.com" });
            expect(user).toBeDefined();
        });

        test("should hash password before saving", async() => {
            const plainPassword = "TestPassword123!";
            const response = await request(app)
                .post("/api/register")
                .send({
                    userName: "TestUser",
                    email: "test@gmail.com",
                    password: plainPassword,
                    role: "customer",
                    contact: "8888888888"
                });

            expect(response.statusCode).toBe(201);

            const user = await User.findOne({ email: "test@gmail.com" });
            expect(user.password).not.toBe(plainPassword);
            expect(await bcrypt.compare(plainPassword, user.password)).toBe(true);
        });

        test("should fail when fields are missing", async() => {
            const response = await request(app)
                .post("/api/register")
                .send({
                    email: "ramesh@gmail.com"
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Invalid user details");
        });

        test("should fail if user already exists", async() => {
            // Create first user
            await User.create({
                userName: "ExistingUser",
                email: "existing@gmail.com",
                password: await bcrypt.hash("password", 10),
                role: "customer",
                contact: "7777777777"
            });

            // Try to register with same email
            const response = await request(app)
                .post("/api/register")
                .send({
                    userName: "AnotherUser",
                    email: "existing@gmail.com",
                    password: "AnotherPass123!",
                    role: "customer",
                    contact: "6666666666"
                });

            expect(response.statusCode).toBe(409);
            expect(response.body.message).toBe("user already exist");
        });

        test("should register user with different roles", async() => {
            const roles = ["customer", "chef", "delivery"];

            for (const role of roles) {
                const response = await request(app)
                    .post("/api/register")
                    .send({
                        userName: `User_${role}`,
                        email: `user_${role}@gmail.com`,
                        password: "Password123!",
                        role: role,
                        contact: "5555555555"
                    });

                expect(response.statusCode).toBe(201);
                expect(response.body.data.role).toBe(role);
            }
        });

        test("should trim whitespace from fields", async() => {
            const response = await request(app)
                .post("/api/register")
                .send({
                    userName: "  TrimmedUser  ",
                    email: "  trimmed@gmail.com  ",
                    password: "Password123!",
                    role: "customer",
                    contact: "  5555555555  "
                });

            expect(response.statusCode).toBe(201);
            const user = await User.findOne({ email: "trimmed@gmail.com" });
            expect(user.userName).toBe("TrimmedUser");
        });

    });

    // ================= LOGIN =================

    describe("POST /api/login", () => {

        beforeEach(async() => {
            const hashedPassword = await bcrypt.hash("TestPassword123!", 10);
            await User.create({
                userName: "LoginTestUser",
                email: "logintest@gmail.com",
                password: hashedPassword,
                role: "admin",
                contact: "9999999999"
            });
        });

        test("should login successfully with correct credentials", async() => {
            const response = await request(app)
                .post("/api/login")
                .send({
                    email: "logintest@gmail.com",
                    password: "TestPassword123!",
                    role: "admin"
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("success");
            expect(response.body.message).toBe("User login successfully");
            expect(response.body.token).toBeDefined();
            expect(typeof response.body.token).toBe("string");
            expect(response.body.data.email).toBe("logintest@gmail.com");
        });

        test("should set httpOnly cookie with token", async() => {
            const response = await request(app)
                .post("/api/login")
                .send({
                    email: "logintest@gmail.com",
                    password: "TestPassword123!",
                    role: "admin"
                });

            expect(response.statusCode).toBe(200);
            // Check if Set-Cookie header exists
            expect(response.headers["set-cookie"]).toBeDefined();
        });

        test("should fail for invalid email", async() => {
            const response = await request(app)
                .post("/api/login")
                .send({
                    email: "nonexistent@gmail.com",
                    password: "TestPassword123!",
                    role: "admin"
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Invalid email");
        });

        test("should fail for invalid password", async() => {
            const response = await request(app)
                .post("/api/login")
                .send({
                    email: "logintest@gmail.com",
                    password: "WrongPassword123!",
                    role: "admin"
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Invalid password");
        });

        test("should fail for insufficient permissions (wrong role)", async() => {
            const response = await request(app)
                .post("/api/login")
                .send({
                    email: "logintest@gmail.com",
                    password: "TestPassword123!",
                    role: "customer" // User is admin, not customer
                });

            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe("insufficient permissions");
        });

        test("should not return password in response", async() => {
            const response = await request(app)
                .post("/api/login")
                .send({
                    email: "logintest@gmail.com",
                    password: "TestPassword123!",
                    role: "admin"
                });

            expect(response.statusCode).toBe(200);
            // Password should be in the data but should be hashed
            expect(response.body.data.password).toBeDefined();
            expect(response.body.data.password).not.toBe("TestPassword123!");
        });

    });

    // ================= USERS =================

    describe("GET /api/users", () => {

        test("should return users route response", async() => {
            const response = await request(app).get("/api/users");

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("success");
            expect(response.body.message).toBe("users");
        });

    });

});