const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      image: String,
      makingStatus: {
        type: String,
        enum: ["not accepted", "Making", "completed"],
        default: "not accepted"
      }
    }
  ],

  totalAmount: Number,

  orderStatus: {
    type: String,
    enum: ["pending", "preparing", "ready", "completed"],
    default: "pending"
  },

  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment"
  },

  deliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
