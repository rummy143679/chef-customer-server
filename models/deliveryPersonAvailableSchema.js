// models/deliveryPersonAvailableSchema.js
const mongoose = require("mongoose");

const deliveryPersonAvailableSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to your User collection
      required: true,
      unique: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "DeliveryPersonAvailable",
  deliveryPersonAvailableSchema
);
