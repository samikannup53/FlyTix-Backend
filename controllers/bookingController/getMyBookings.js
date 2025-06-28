const Booking = require("../../models/booking/booking");

async function getMyBookings(req, res) {
  try {
    // Validate Authonticated User
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    const userId = req.user._id;

    // Fetch Bookings Sorted by Latest
    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .select("-__v");

    // Handle No Bookings Case
    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ msg: "No Bookings Found" });
    }

    // Send Result
    res.status(200).json({ totalBookings: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
}

module.exports = getMyBookings;
