const express = require("express");
const router = express.Router();
const searchFlights = require("../controllers/flightController/searchFlights");
const validateFlight = require("../controllers/flightController/validateFlight");

// Routes
router.post("/search", searchFlights);
router.post("/validate", validateFlight);

module.exports = router;
