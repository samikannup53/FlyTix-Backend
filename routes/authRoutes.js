const express = require("express");
const router = express.Router();

// Import Auth Middleware
const authUser = require("../middlewares/userAuthMiddlware");

// Import Controller Functions
const registerUser = require("../controllers/authController/registerUser");
const loginUser = require("../controllers/authController/loginUser");
const logoutUser = require("../controllers/authController/logoutUser");
const changePassword = require("../controllers/authController/changePassword");
const { initiateForgotPassword, resendOtpForForgotPassword, validateAndResetPassword } = require("../controllers/authController/forgotPassword");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/change-password", authUser, changePassword);
router.post('/forgot-password/initiate', initiateForgotPassword);
router.post('/forgot-password/resend-otp', resendOtpForForgotPassword);
router.post('/forgot-password/reset', validateAndResetPassword)

module.exports = router;
