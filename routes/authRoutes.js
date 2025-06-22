const express = require("express");
const router = express.Router();
const registerUser = require("../controllers/authController/registerUser");
const loginUser = require("../controllers/authController/loginUser");
const logoutUser = require("../controllers/authController/logoutUser");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
