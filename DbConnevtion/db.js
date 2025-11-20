const mongoose = require("mongoose");
require("dotenv").config();
// require("dns").setDefaultResultOrder("ipv4first");  // <--- IMPORTANT FIX FOR NODE 22


// when the shows error [nodemon] app crashed - waiting for file changes before starting...
// create ne project in the mongodb and work
const connectDB = async () => {
  try {

    // if (process.env.NODE_ENV === "local") {
    //   if (mongoose.connection.readyState === 1) {
    //     console.log("Closing previous MongoDB connection...");
    //     await mongoose.connection.close();  // Close old connection only in dev
    //   }
    // }

    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // connectTimeoutMS: 60000,
      // serverSelectionTimeoutMS: 60000,
      serverSelectionTimeoutMS: 60000,
      // socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // exit process if DB connection fails
  }
};

module.exports = connectDB;
