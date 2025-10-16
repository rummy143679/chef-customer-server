const express = require('express');
const  router = express.Router();
const {register,login,  users} = require('../contollers/userControllers');


router.post("/register", register);
router.post("/login", login);
router.get("/users", users);

module.exports = router