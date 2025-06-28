const express = require("express");
const router = express.Router();
const registerUser = require("../controllers/authController/registerUser");
const loginUser = require("../controllers/authController/loginUser");
const logoutUser = require("../controllers/authController/logoutUser");
const changePassword = require("../controllers/authController/changePassword");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/change-password", changePassword);

module.exports = router;
