const DeliveryBoy = require("../models/DeliveryBoy");

exports.loginDeliveryBoy = async (req, res) => {
    try {
        const { phone, password, lat, lng } = req.body;

        const deliveryBoy = await DeliveryBoy.findOne({ phone });
        if (!deliveryBoy) return res.status(400).json({ success: false, message: "User not found" });

        if (deliveryBoy.password !== password)
            return res.status(400).json({ success: false, message: "Invalid credentials" });

        // Set online + save location
        deliveryBoy.status = "online";
        deliveryBoy.currentLocation = {
            type: "Point",
            coordinates: [lng, lat]
        };
        await deliveryBoy.save();

        return res.json({
            success: true,
            message: "Delivery boy logged in",
            deliveryBoy
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.updateLocation = async (req, res) => {
    try {
        const { userId, lat, lng } = req.body;

        const updated = await DeliveryBoy.findByIdAndUpdate(
            userId,
            {
                currentLocation: {
                    type: "Point",
                    coordinates: [lng, lat]
                }
            },
            { new: true }
        );

        return res.json({ success: true, location: updated.currentLocation });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};



exports.logoutDeliveryBoy = async (req, res) => {
    try {
        const { userId } = req.body;

        const updated = await DeliveryBoy.findByIdAndUpdate(
            userId,
            { status: "offline" },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Delivery boy logged out",
            updated
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
