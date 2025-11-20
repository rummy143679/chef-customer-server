const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },

  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  deliveryType: {
    type: String,
    enum: ["online", "offline"],
    default: "online"
  },

  deliveryStatus: {
    type: String,
    enum: ["not picked", "picked", "on the way", "reached", "delivered"],
    default: "not picked"
  },

  location: {
    lat: Number,
    lng: Number,
    address: String
  },

  deliveryBoyLocation: {
    lat: Number,
    lng: Number,
  },

  timeline: {
    pickedAt: Date,
    reachedAt: Date,
    deliveredAt: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("Delivery", DeliverySchema);
