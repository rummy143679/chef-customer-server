// const Order = require('../models/orderModel');


// const getAllOrders = async (req, res) => {
//     try {
//         const orders = await Order.find();
//         res.status(200).json({ status: "success", message: "Fetched all orders", data: orders });
//     } catch (error) {
//         res.status(500).json({ status: "error", message: "Error fetching orders" });
//     }
// };

// const createOrder = async (req, res) => {
//     try {
//         const newOrder = new Order(req.body);
//         await newOrder.save();
//         res.status(201).json({ status: "success", message: "Order created successfully", data: newOrder });
//     } catch (error) {
//         res.status(500).json({ status: "error", message: "Error creating order" });
//     }
// };

// const getOrders = async (req, res) => {
//     try{
//         const orders = await Order.
//     }catch(e){
//         return res.status(500),json({status: "failed", error: e});
//     }
// }


// module.exports = { getAllOrders, createOrder, getOrdersForChef };