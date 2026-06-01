const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/paymentSchema");
const Order = require("../models/orderSchema");
const Delivery = require("../models/deliverySchema");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// 1️⃣ Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
    console.log("create payment");
    try {
        const { amount } = req.body;

        if (!amount)
            return res.status(400).json({ success: false, message: "Amount missing" });

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };


        const order = await razorpay.orders.create(options);
        console.log(order);
        res.json({ success: true, order });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2️⃣ Verify Payment + Create Order
exports.verifyPaymentAndCreateOrder = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            totalAmount,
            customerId,
            customerLocation
        } = req.body;

        // Signature verification
        // const sign = razorpay_order_id + "|" + razorpay_payment_id;
        // const expected = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
        //     .update(sign)
        //     .digest("hex");

        // if (expected !== razorpay_signature) {
        //     return res.status(400).json({ success: false, message: "Signature match failed" });
        // }

        // Create order
        const newOrder = await Order.create({
            customerId,
            items: items.map(item => ({
                ...item,
                makingStatus: "not accepted" // initial item status
            })),
            totalAmount,
            orderStatus: "preparing" // initial order status
        });

        // Save payment
        const payment = await Payment.create({
            orderId: newOrder._id || mongoose.Types.ObjectId(),
            amount: totalAmount || 23,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            status: "Paid"
        });

        newOrder.paymentId = payment._id;
        await newOrder.save();

        // Delivery record
        const delivery = await Delivery.create({
            orderId: newOrder._id,
            customerId,
            deliveryStatus: "not picked",
            location: customerLocation || { lat: 0, lng: 0 }
        });

        newOrder.deliveryId = delivery._id;
        await newOrder.save();

        res.json({ success: true, order: newOrder });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};




// module.exports = { handlePayment }