const express = require('express');
const cors = require('cors');
require("dotenv").config()
const router = require('./routers/router')
const dbConnection = require('./DbConnevtion/db');


const app = express();

app.use(express.json());
const allowedOrigins = [
    "http://localhost:5173",             // for local dev
    "https://enchanting-paprenjak-aa52b4.netlify.app"    // Netlify frontend URL
];

app.use(
    cors({
        origin: allowedOrigins, // deployed frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

dbConnection();

app.use("/api/v1.0", router);

// deployment config for production
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../client/dist");
    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(frontendPath, "index.html"));
    });
}


const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})