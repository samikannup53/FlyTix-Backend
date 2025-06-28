const express = require("express");
const router = express.Router();

// Import Auth Middleware
const authUser = require("../middlewares/userAuthMiddlware");

// Import Controller Functions
const registerUser = require("../controllers/authController/registerUser");
const loginUser = require("../controllers/authController/loginUser");
const logoutUser = require("../controllers/authController/logoutUser");
const changePassword = require("../controllers/authController/changePassword");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/change-password", authUser, changePassword);

module.exports = router;
