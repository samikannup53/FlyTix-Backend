const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/userAuthMiddlware");

const initiateBooking = require("../controllers/bookingController/initiateBooking");
const cancelBooking = require("../controllers/bookingController/cancelBooking");
const rescheduleBooking = require("../controllers/bookingController/rescheduleBooking");
const getMyBookings = require("../controllers/bookingController/getMyBookings");
const getBookingById = require("../controllers/bookingController/getBookingById");
const generateTicket = require("../controllers/bookingController/generateTicket");

router.post("/initiate", authUser, initiateBooking);
router.post("/cancel", authUser, cancelBooking);
router.post("/reschedule", authUser, rescheduleBooking);
router.get("/mybookings", authUser, getMyBookings);
router.get("/:bookingId", authUser, getBookingById);
router.get("/:bookingId/ticket", generateTicket);

module.exports = router;
