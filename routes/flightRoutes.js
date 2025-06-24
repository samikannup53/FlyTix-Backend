const express = require("express");
const router = express.Router();
const searchFlights = require("../controllers/flightController/searchFlights");

// Routes
router.get("/search", searchFlights);

module.exports = router;
