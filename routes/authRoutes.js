const express = require("express");
const router = express.Router();
const registerUser = require("../controllers/authController/registerUser");
const loginUser = require("../controllers/authController/loginUser");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
