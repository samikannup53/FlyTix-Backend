const express = require("express");
const router = express.Router();

const initiateBooking = require("../controllers/bookingController/initiateBooking");
const cancelBooking = require("../controllers/bookingController/cancelBooking");
const rescheduleBooking = require("../controllers/bookingController/rescheduleBooking");
const getMyBookings = require("../controllers/bookingController/getMyBookings");

router.post("/initiate", initiateBooking);
router.post("/cancel", cancelBooking);
router.post("/reschedule", rescheduleBooking);
router.get("/mybookings", getMyBookings);

module.exports = router;
