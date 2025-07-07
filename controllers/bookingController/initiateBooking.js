const Booking = require("../../models/booking/booking");
const FlightCache = require("../../models/flight/flightCache");

async function initiateBooking(req, res) {
  // Validate Authenticated User
  if (!req.user || !req.user._id) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

  const userId = req.user._id;

  // Get session ID from cookie
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.status(400).json({ msg: "Session ID missing in cookies" });
  }

  // Get required booking fields from request body
  const { flightId, travellers, contactDetails, billingAddress } =
    req.body || {};

  //  Validate all required fields
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
    // Fetch the flight cache by session ID
    const flightCache = await FlightCache.findOne({ sessionId });

    if (!flightCache) {
      return res.status(404).json({ msg: "Session Expired or Invalid" });
    }

    // Find selected flight by flightId
    const selectedFlight = flightCache.data.find((flight) => {
      return flight.flightId === flightId;
    });

    if (!selectedFlight) {
      return res
        .status(404)
        .json({ msg: "Flight Not Found in Cached Session" });
    }

    // Map individual segment to the new format
    const mapSegment = (segment) => ({
      airlineCode: segment.airlineCode,
      airlineName: segment.airlineName,
      flightNumber: segment.flightNumber,
      from: {
        date: segment.departure.date,
        time: segment.departure.time,
        cityCode: segment.departure.cityCode,
        city: segment.departure.city,
        state: segment.departure.state,
        country: segment.departure.country,
        airport: segment.departure.airport,
        terminal: segment.departure.terminal,
      },
      to: {
        date: segment.arrival.date,
        time: segment.arrival.time,
        cityCode: segment.arrival.cityCode,
        city: segment.arrival.city,
        state: segment.arrival.state,
        country: segment.arrival.country,
        airport: segment.arrival.airport,
        terminal: segment.arrival.terminal,
      },
    });

    // Build the full journey object as per updated schema
    const journey = {
      outbound: {
        segments: selectedFlight.outbound.segments.map(mapSegment),
        duration: selectedFlight.outbound.duration,
        stops: selectedFlight.outbound.stops,
      },
      travelClass: selectedFlight.class,
      baggage: selectedFlight.baggage,
    };

    // If returnTrip exists, map and include it
    if (selectedFlight.returnTrip) {
      journey.returnTrip = {
        segments: selectedFlight.returnTrip.segments.map(mapSegment),
        duration: selectedFlight.returnTrip.duration,
        stops: selectedFlight.returnTrip.stops,
      };
    }

    // Get fare details
    const fareDetails = selectedFlight.fare;

    // Set booking expiration time (3 hours from now)
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

    // Create and save booking
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

    // Send success response
    res.status(201).json({
      msg: "Booking Initiated Successfully",
      newBooking,
    });
  } catch (error) {
    // Handle unexpected errors
    res
      .status(500)
      .json({ msg: "Failed to Initiate Booking", error: error.message });
  }
}

module.exports = initiateBooking;
