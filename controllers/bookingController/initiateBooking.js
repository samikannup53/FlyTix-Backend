const Booking = require("../../models/booking/booking");
const FlightCache = require("../../models/flight/flightCache");

async function initiateBooking(req, res) {
  // Validate Authenticated User
  if (!req.user || !req.user._id) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

  const userId = req.user._id;

  const sessionId = req.cookies.sessionId;

  const { flightId, travellers, contactDetails, billingAddress } =
    req.body || {};

  if (
    !sessionId ||
    !flightId ||
    !travellers ||
    !contactDetails ||
    !billingAddress
  ) {
    return res
      .status(400)
      .json({ msg: "Missing Required Details to Initiate Booking" });
  }

  try {
    // Fetch Fligt Cache
    const flightCache = await FlightCache.findOne({ sessionId });

    if (!flightCache) {
      return res.status(404).json({ msg: "Session Expired or Invalid" });
    }

    // Find Selected Flight
    const selectedFlight = flightCache.data.find((flight) => {
      return flight.flightId === flightId;
    });

    if (!selectedFlight) {
      return res
        .status(404)
        .json({ msg: "Flight Not Found in Cached Session" });
    }

    // Build Journey
    const buildJourney = (
      segments,
      travelClass,
      airline,
      baggage,
      stops,
      duration
    ) => {
      return segments.map((segment) => {
        return {
          from: {
            cityCode: segment.departure.cityCode,
            city: segment.departure.city || "N/A",
            airport: segment.departure.airport,
            terminal: segment.departure.terminal,
            date: segment.departure.date,
            time: segment.departure.time,
          },
          to: {
            cityCode: segment.arrival.cityCode,
            city: segment.arrival.city || "N/A",
            airport: segment.arrival.airport,
            terminal: segment.arrival.terminal,
            date: segment.arrival.date,
            time: segment.arrival.time,
          },
          flightNumber: segment.flightNumber,
          airline,
          duration,
          stops,
          travelClass,
          baggage,
        };
      });
    };

    const journey = buildJourney(
      selectedFlight.outbound.segments,
      selectedFlight.class,
      selectedFlight.validatingAirline,
      selectedFlight.baggage,
      selectedFlight.outbound.stops,
      selectedFlight.outbound.duration
    );

    const fareDetails = selectedFlight.fare;

    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

    const newBooking = await Booking.create({
      userId,
      tripType: selectedFlight.returnTrip ? "Roundtrip" : "Oneway",
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
      newBooking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Failed to Initiate Booking", error: error.message });
  }
}

module.exports = initiateBooking;
