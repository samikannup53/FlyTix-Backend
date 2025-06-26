const express = require("express");
const router = express.Router();

const initiateBooking = require("../controllers/bookingController/initiateBooking");

router.get("/initiate", initiateBooking);

module.exports = router;
