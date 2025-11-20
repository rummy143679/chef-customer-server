const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },

  amount: Number,

  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,

  status: {
    type: String,
    enum: ["Paid", "Failed"],
    default: "Paid"
  }

}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
