const Booking = require("../../models/booking/booking");

async function getBookingById(req, res) {
  try {
    // Validate Authenticated User
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    const userId = req.user._id;

    const { bookingId } = req.params || {};

    if (!bookingId) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    const booking = await Booking.findOne({ bookingId, userId }).select("-__v");

    if (!booking) {
      return res.status(404).json({
        msg: `No Booking Found with Booking ID: ${bookingId}`,
      });
    }
    res.status(200).json({
      msg: `Booking Found Successfully with given Booking ID: ${bookingId}`,
      booking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Failed to fetch booking", error: error.message });
  }
}

module.exports = getBookingById;
