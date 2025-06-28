const Booking = require("../../models/booking/booking");

async function cancelBooking(req, res) {

  // Validate Authenticated User
  if (!req.user || !req.user._id) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

  const userId = req.user._id;

  const { bookingId, reason } = req.body || {};

  if (!bookingId || !userId || !reason) {
    return res
      .status(400)
      .json({ msg: "Missing Required Details to Cancel Booking" });
  }

  try {
    const booking = await Booking.findOne({ bookingId, userId });

    if (!booking) {
      return res
        .status(404)
        .json({ msg: `Booking Not Found with Booking ID : ${bookingId}` });
    }

    if (booking.expiresAt && booking.expiresAt < new Date()) {
      return res.status(400).json({ msg: "Booking Expired" });
    }

    if (booking.bookingStatus === "Cancelled") {
      return res.status(400).json({
        msg: `Booking Already Cancelled for Booking ID : ${bookingId}`,
      });
    }

    if (booking.bookingStatus === "Pending") {
      return res
        .status(400)
        .json({ msg: "Cancellation Not Allowed for Pending Bookings" });
    }

    if (!booking.journey || !booking.journey[0] || !booking.journey[0].from) {
      return res.status(400).json({ msg: "Invalid Journey Data" });
    }

    const departureTime = new Date(
      `${booking.journey[0].from.date}T${booking.journey[0].from.time}`
    );

    const hoursLeft = (departureTime - new Date()) / (1000 * 60 * 60);

    if (hoursLeft < 3) {
      return res.status(400).json({
        msg: "Cancellation Not Allowed Less than 3 Hours Before Departure",
      });
    }

    const refund =
      hoursLeft >= 24
        ? Math.round(booking.fareDetails.totalFare * 0.8 * 100) / 100
        : Math.round(booking.fareDetails.totalFare * 0.5 * 100) / 100;

    booking.bookingStatus = "Cancelled";

    booking.cancellation = {
      isCancelled: true,
      cancelledAt: new Date(),
      cancelledBy: userId,
      reason,
      refundAmount: refund,
      refundStatus: "Pending",
    };

    await booking.save();

    return res.status(200).json({
      msg: "Booking Cancelled Successfully",
      bookingId: booking.bookingId,
      pnr: booking.pnr,
      refundAmount: refund,
      cancellationDetails: booking.cancellation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error cancelling booking", error: error.message });
  }
}

module.exports = cancelBooking;
