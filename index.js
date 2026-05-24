const express = require('express');
const cors = require('cors');
require("dotenv").config()
const router = require('./routers/router')
const dbConnection = require('./DbConnevtion/db');
const path = require('path');
const mongoose = require('mongoose');



const app = express();

app.use(express.json());
const allowedOrigins = [
    "http://localhost:5173", // for local dev
    "https://chef-customer.netlify.app", // Netlify frontend URL
    "http://localhost:4173"
];

app.use(
    cors({
        origin: allowedOrigins, // deployed frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

// dbConnection();

// have connection problem with mongo db check if the ip address is added or delete db user and create new user

app.use("/api/v1.0", router);

// deployment config for production
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../client/dist");
    app.use(express.static(frontendPath));

    app.get((req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}


// const startServer = async() => {
//     await dbConnection();
//     // mongoose.connect("mongodb+srv://chefdbuser:chefdbuser@cluster0.2vhygf3.mongodb.net/?appName=Cluster0")
//     const port = process.env.PORT || 5000;
//     app.listen(port, () => console.log(`✅ Server running on port ${port}`));
// };

// startServer();
module.exports = app;