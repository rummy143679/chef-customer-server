// tests/auth.test.js

const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const {
    createJwtToken,
    authenticateToken
} = require("../utility/createJwtToken");

require("dotenv").config();

const app = express();
app.use(express.json());


// Protected Route
app.get("/protected", authenticateToken, (req, res) => {
    res.status(200).json({
        status: "success",
        user: req.user
    });
});


describe("Authentication Testing", () => {

    // ================= JWT TOKEN =================

    describe("createJwtToken()", () => {

        test("should create JWT token", async() => {

            const user = {
                userName: "Ramesh",
                email: "ramesh@gmail.com",
                role: "admin"
            };

            const token = await createJwtToken(user);

            expect(token).toBeDefined();
            expect(typeof token).toBe("string");

        });

    });


    // ================= AUTH MIDDLEWARE =================

    describe("authenticateToken Middleware", () => {

        test("should allow access with valid token", async() => {

            const token = jwt.sign({
                    userName: "Ramesh",
                    email: "ramesh@gmail.com",
                    role: "admin"
                },
                process.env.JWT_KEY, { expiresIn: "1h" }
            );

            const response = await request(app)
                .get("/protected")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("success");
            expect(response.body.user.email).toBe("ramesh@gmail.com");

        });


        test("should return 401 if token missing", async() => {

            const response = await request(app)
                .get("/protected");

            expect(response.statusCode).toBe(401);

        });


        test("should return 403 for invalid token", async() => {

            const response = await request(app)
                .get("/protected")
                .set("Authorization", "Bearer invalidtoken");

            expect(response.statusCode).toBe(403);

        });

    });

});