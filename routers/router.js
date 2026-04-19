const express = require('express');
const router = express.Router();
const { register, login, users } = require('../contollers/userControllers');
const { addNewDish, fetchDishes, deleteDish, deleteAllDishes, addAllDishes } = require('../contollers/dishController');
const { getTopItemsFromEachCategory, getTopRated, getDishesByCategory } = require('../contollers/customerController')
const { getByCategoryAndRating, getByPriceRange, getByCategory, deleteManyDishes, insertOneDish, dishByName, findAllDishes, insertMenyDish, withRequiredFields, updateOneDish, updateManyDish, deleteOneDish } = require('../contollers/Dish-Controller');
// const { handlePayment } = require('../contollers/paymentController');
const { postOrders, getAllOrders, getOrdersForChef, updateOrderItemStatus } = require('../contollers/OrdersController');
const {
    createRazorpayOrder,
    verifyPaymentAndCreateOrder,
} = require("../contollers/paymentController");
const deliveryCtrl = require("../contollers/deliveryController");


// login routers
router.post("/register", register);
router.post("/login", login);
router.get("/users", users);

// chef routers 

//dishes routers
router.post("/add-dish", addNewDish);
// these two for testing purposes only
// router.post("/add-all-dishes", addAllDishes);
// router.delete("/delete-all-dishes", deleteAllDishes);
router.get("/dishes", fetchDishes);
router.delete("/delete-dish/:id", deleteDish);


// customer routers

router.get("/tioec", getTopItemsFromEachCategory); // tioec - top items of each category
router.get("/top-rated", getTopRated)
router.get("/category-wise", getDishesByCategory)


// Dish-Schema routers

router.post("/insert-one-dish", insertOneDish)
router.get("/find-one-by-name/:name", dishByName)
router.get("/find-all-dishes", findAllDishes)
router.post("/insert-meny-dishes", insertMenyDish);
router.get("/with-required-fields", withRequiredFields)
router.patch("/update-one-dish/:name", updateOneDish)
router.post("/update-many-dishes", updateManyDish)
router.delete("/delete-one-by-id/:id", deleteOneDish)
router.delete("/delete-many-dishes", deleteManyDishes)
router.get("/by-category/:category", getByCategory)
router.get("/price", getByPriceRange)
router.get("/dishes", getByCategoryAndRating)

// payment handling
// router.post("/payment", handlePayment)
router.post("/payment/create", createRazorpayOrder);
router.post("/payment/verify", verifyPaymentAndCreateOrder);

//Orders
router.post("/order", postOrders)
router.get("/orders/:id", getAllOrders);
router.post("/orders", getOrdersForChef);
router.post("/orders/:orderId/:itemId", updateOrderItemStatus);

// delivery
// update location
router.post("/delivery-boy/location", deliveryCtrl.updateDeliveryBoyLocation)
// Assign delivery boy
router.post("/delivery/assign", deliveryCtrl.assignDeliveryBoy);

// Delivery boy picks order
router.put("/delivery/:id/pick", deliveryCtrl.pickOrder);

// Start delivery (on the way)
router.put("/delivery/:id/start", deliveryCtrl.startDelivery);

// Update live location
router.put("/delivery/:id/location", deliveryCtrl.updateLocation);

// Reached customer location
router.put("/delivery/:id/reached", deliveryCtrl.reachedDestination);

// Mark delivered
router.put("/delivery/:id/delivered", deliveryCtrl.markDelivered);

// Get delivery details
router.get("/delivery/:id", deliveryCtrl.getDeliveryDetails);

// Get delivery boy active deliveries
router.get("/delivery-boy/active/:id", deliveryCtrl.getActiveDeliveries);

// logout
router.post("/delivery-boy/logout", deliveryCtrl.logoutDeliveryBoy);


module.exports = router