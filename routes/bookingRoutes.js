const express = require("express");
const router = express.Router();

const initiateBooking = require("../controllers/bookingController/initiateBooking");
const cancelBooking = require("../controllers/bookingController/cancelBooking");
const resheduleBooking = require("../controllers/bookingController/resheduleBooking");

router.post("/initiate", initiateBooking);
router.get("/cancel", cancelBooking);
router.get("/reshedule", resheduleBooking);

module.exports = router;
