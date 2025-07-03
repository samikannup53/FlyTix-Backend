const express = require("express");
const router = express.Router();

const getAirports = require("../controllers/airportController/getAirports");

router.get("/", getAirports);

module.exports = router;
