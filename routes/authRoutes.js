const express = require("express");
const router = express.Router();
const registerUser = require("../controllers/authController/registerUser");

// Routes
router.post("/register", registerUser);

module.exports = router;
