const Delivery = require("../models/deliverySchema");
const Order = require("../models/orderSchema");
const DeliveryPersonAvailable = require("../models/deliveryPersonAvailableSchema");

// DELETE /delivery-boy/logout
exports.logoutDeliveryBoy = async (req, res) => {
    try {
        const deliveryBoyId = req.body.userId;

        // Remove delivery boy from availability
        await DeliveryPersonAvailable.findOneAndDelete({ deliveryBoyId });

        res.json({ success: true, message: "Logged out and removed from available delivery boys" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ================================
// update delivery boy location and status (Admin/Auto)
// ================================
exports.updateDeliveryBoyLocation = async (req, res) => {
    try {
        const { userId, lat, lng } = req.body;

        if (!userId || lat === undefined || lng === undefined) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required data" });
        }

        // Check if the delivery partner already exists
        let deliveryPerson = await DeliveryPersonAvailable.findOne({ userId });

        if (deliveryPerson) {
            // Update existing record
            deliveryPerson.location = { lat, lng };
            deliveryPerson.lastUpdated = Date.now();
            deliveryPerson.status = "online";
            await deliveryPerson.save();
        } else {
            // Create a new record
            deliveryPerson = await DeliveryPersonAvailable.create({
                userId,
                location: { lat, lng },
                status: "online",
            });
        }

        res.json({
            success: true,
            message: "Location updated successfully",
            deliveryPerson,
        });
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ success: false, message: "Internal server error", error: err.message });
    }
};


// ================================
// ASSIGN DELIVERY BOY (Admin/Auto)
// ================================
exports.assignDeliveryBoy = async (req, res) => {
    try {
        const { orderId, deliveryType } = req.body;

        // Find all delivery boys who are online
        const availableDeliveryBoys = await DeliveryPersonAvailable.find({ status: "online" });

        if (!availableDeliveryBoys || availableDeliveryBoys.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No delivery boys available at the moment",
            });
        }

        // Pick the first available delivery boy (you can add better logic like nearest or load balancing)
        const deliveryBoy = availableDeliveryBoys[0];

        // Create delivery record
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }


        const delivery = await Delivery.findOneAndUpdate(
            {
                orderId: order._id
            },
            // {
            //     $set: { deliveryBoyId: deliveryBoy._id, location: { lng: deliveryBoy.location.lng, lat: deliveryBoy.location.lat }, timeline: { pickedAt: Date.now() } }
            // }
            {
                $set: { deliveryBoyId: deliveryBoy._id, timeline: { pickedAt: Date.now() } }
            }
        )

        res.json({
            success: true,
            message: "Delivery boy assigned successfully",
            delivery,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};


// ================================
// DELIVERY BOY PICKS ORDER
// ================================
exports.pickOrder = async (req, res) => {
    try {
        const deliveryId = req.params.id;
        // const deliveryBoyId = req.user._id;

        const delivery = await Delivery.findByIdAndUpdate(
            deliveryId,
            {
                // deliveryBoyId,
                deliveryStatus: "picked",
                "timeline.pickedAt": new Date()
            },
            { new: true }
        );

        res.json({
            success: true,
            message: "Order picked successfully",
            delivery
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================================
// START DELIVERY (On the Way)
// ================================
exports.startDelivery = async (req, res) => {
    try {
        const deliveryId = req.params.id;
        const { lat, lng } = req.body;

        const delivery = await Delivery.findByIdAndUpdate(
            deliveryId,
            {
                deliveryStatus: "on the way",
                // location: { lat, lng }
                deliveryBoyLocation: {lat, lng},
            },
            { new: true }
        );

        res.json({
            success: true,
            message: "Delivery started",
            delivery
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================================
// UPDATE LIVE LOCATION (OPTIONAL)
// ================================
exports.updateLocation = async (req, res) => {
    try {
        const deliveryId = req.params.id;
        const { lat, lng } = req.body;

        const delivery = await Delivery.findByIdAndUpdate(
            deliveryId,
            {
                location: { lat, lng }
            },
            { new: true }
        );

        res.json({
            success: true,
            message: "Location updated",
            delivery
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================================
// DELIVERY BOY REACHED DESTINATION
// ================================
exports.reachedDestination = async (req, res) => {
    try {
        const deliveryId = req.params.id;

        const delivery = await Delivery.findByIdAndUpdate(
            deliveryId,
            {
                deliveryStatus: "reached",
                "timeline.reachedAt": new Date()
            },
            { new: true }
        );

        res.json({
            success: true,
            message: "Reached customer location",
            delivery
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================================
// DELIVERY COMPLETED
// ================================
exports.markDelivered = async (req, res) => {
    try {
        const deliveryId = req.params.id;

        const delivery = await Delivery.findByIdAndUpdate(
            deliveryId,
            {
                deliveryStatus: "delivered",
                "timeline.deliveredAt": new Date()
            },
            { new: true }
        );

        // Update Order Status as well
        await Order.findByIdAndUpdate(delivery.orderId, {
            orderStatus: "delivered"
        });

        res.json({
            success: true,
            message: "Order delivered successfully",
            delivery
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================================
// GET DELIVERY DETAILS
// ================================
exports.getDeliveryDetails = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id)
            .populate("orderId customerId deliveryBoyId");

        res.json({
            success: true,
            delivery
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================================
// GET ACTIVE DELIVERY FOR DELIVERY BOY
// ================================
exports.getActiveDeliveries = async (req, res) => {
    try {
        // console.log(req.body);
        const userId = req.params.id;
        const deliveryBoy = await DeliveryPersonAvailable.findOne({ userId });
        if (!deliveryBoy) {
            return res.status(404).json({ message: "Delivery boy not found" });
        }
        const activeDeliveries = await Delivery.find({
            deliveryBoyId: deliveryBoy._id,
            deliveryStatus: { $ne: "delivered" } // ACTIVE STATUSES
        }).populate("orderId")
            .populate("customerId")
            .populate("deliveryBoyId");;
        console.log(activeDeliveries)
        res.json({
            success: true,
            activeDeliveries
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

