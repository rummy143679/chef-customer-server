const express = require('express');
const cors = require('cors');
require("dotenv").config()
const router = require('./routers/router')
const dbConnection = require('./DbConnevtion/db');


const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173", // your frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

dbConnection();

app.use("/api/v1.0", router); 



const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})