const Orders = require('../models/orderSchema');

const postOrders = async (req, res) => {
    try {

        const newOrder = new Orders(
            {
                items: req.body.items,
                totalAmount: req.body.totalAmount,
                customerId: req.body.customerId,
                razorpay_order_id: req.body.razorpay_order_id,
                razorpay_payment_id: req.body.razorpay_payment_id,
                razorpay_signature: req.body.razorpay_signature,
                paymentStatus: "Paid",
                makingStatus: "not accepted",
                deliveryStatus: "not picked"
            }
        );

        const result = await newOrder.save();

        return res.status(201).json({ success: true, order: result });
    } catch (err) {
        console.error("Order Save Failed:", err);
        return res.status(500).json({ success: false, message: "Failed to save order" });
    }
};

// get all oreders
const getAllOrders = async (req, res) => {
    console.log(req.params.id)
    try {
        const currentOrders = await Orders.find({
            customerId: req.params.id,
            // deliveryStatus: { $ne: "completed" }
            items: {
                $elemMatch: { makingStatus: { $ne: "completed" } }
            }
        });
        const oldOrders = await Orders.find({
            customerId: req.params.id,
            // deliveryStatus: "completed"
            items: {
                $not: {
                    $elemMatch: { makingStatus: { $ne: "completed" } }
                }
            }
        });

        return res.status(200).json({ status: "success", oldOrders, currentOrders });
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e });
    }
}

const getOrdersForChef = async (req, res) => {
    try {
        const orders = await Orders.aggregate([
            // Convert customerId to ObjectId for lookup
            {
                $addFields: {
                    customerObjId: { $toObjectId: "$customerId" }
                }
            },
            // Join with users collection
            {
                $lookup: {
                    from: "users",
                    localField: "customerObjId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            // Compute order status based on item statuses
            {
                $addFields: {
                    status: {
                        $switch: {
                            branches: [
                                // If any item is not accepted
                                {
                                    case: { $gt: [{ $size: { $filter: { input: "$items", cond: { $eq: ["$$this.makingStatus", "not accepted"] } } } }, 0] },
                                    then: "not accepted"
                                },
                                // If any item is accepted or cooking
                                {
                                    case: { $gt: [{ $size: { $filter: { input: "$items", cond: { $in: ["$$this.makingStatus", ["accepted", "cooking"]] } } } }, 0] },
                                    then: "cooking"
                                },
                                // If all items are completed
                                {
                                    case: { $eq: [{ $size: "$items" }, { $size: { $filter: { input: "$items", cond: { $eq: ["$$this.makingStatus", "completed"] } } } }] },
                                    then: "completed"
                                }
                            ],
                            default: "pending"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    orderId: "$_id",
                    userName: "$user.userName",
                    status: 1,
                    totalAmount: 1,
                    items: 1
                }
            }
        ]);

        return res.status(200).json({ status: "success", orders });
    } catch (e) {
        return res.status(500).json({ status: "failed", message: e.message });
    }
};


const updateOrderItemStatus = async (req, res) => {
    try {
        const { orderId, itemId } = req.params;
        const status = req.body.status;
        const updatedOrder = await Orders.findOneAndUpdate(
            { _id: orderId, "items._id": itemId },
            {
                $set: { "items.$.makingStatus": status }
            },
            { new: true }
        )
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order or Item not found" });
        }

        return res.status(200).json({
            message: "Item status updated",
            order: updatedOrder
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({ status: "failed", message: e.message });
    }
}


module.exports = { postOrders, getAllOrders, getOrdersForChef, updateOrderItemStatus };
