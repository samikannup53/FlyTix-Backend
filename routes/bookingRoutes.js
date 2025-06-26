const express = require("express");
const router = express.Router();

const initiateBooking = require("../controllers/bookingController/initiateBooking");

router.post("/initiate", initiateBooking);

module.exports = router;
