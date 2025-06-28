const express = require("express");
const router = express.Router();

const initiateBooking = require("../controllers/bookingController/initiateBooking");
const cancelBooking = require("../controllers/bookingController/cancelBooking");
const rescheduleBooking = require("../controllers/bookingController/rescheduleBooking");

router.post("/initiate", initiateBooking);
router.post("/cancel", cancelBooking);
router.post("/reschedule", rescheduleBooking);

module.exports = router;
