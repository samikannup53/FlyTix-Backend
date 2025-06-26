const Booking = require("../../models/booking/booking");
const FlightCache = require("../../models/flight/flightCache");

async function initiateBooking(req, res) {
  const {
    userId,
    sessionId,
    flightId,
    tripType,
    journey,
    travellers,
    contactDetails,
    billingAddress,
    fareDetails,
  } = req.body;

  if (
    !userId ||
    !sessionId ||
    !flightId ||
    !tripType ||
    !journey ||
    !travellers ||
    !contactDetails ||
    !billingAddress ||
    !fareDetails
  ) {
    return res.status(400).json({ msg: "Missing Required Booking Details" });
  }

  try {
    const flightCache = await FlightCache.findOne({ sessionId });

    if (!flightCache) {
      return res.status(404).json({ msg: "Session Expired or Invalid" });
    }

    const selectedFlight = flightCache.data.find((flight) => {
      return flight.flightId === flightId;
    });

    if (!selectedFlight) {
      return res
        .status(404)
        .json({ msg: "Flight Not Found in Cahced Session" });
    }

    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

    const newBooking = await Booking.create({
      userId,
      tripType,
      journey,
      travellers,
      contactDetails,
      billingAddress,
      fareDetails,
      bookingStatus: "Pending",
      paymentStatus: "Unpaid",
      expiresAt,
    });

    res.status(201).json({
      msg: "Booking Initiated Successfully",
      bookingId: newBooking._id,
      bookingReferenceId: newBooking.bookingReferenceId,
      bookingStatus: newBooking.bookingStatus,
      paymentStatus: newBooking.paymentStatus,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Failed to Initiate Booking", error: error.message });
  }
}

module.exports = initiateBooking;
