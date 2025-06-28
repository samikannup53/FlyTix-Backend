const Booking = require("../../models/booking/booking");
const FlightCache = require("../../models/flight/flightCache");

async function rescheduleBooking(req, res) {
  const { bookingId, userId, sessionId, flightId } = req.body || {};

  if (!bookingId || !userId || !sessionId || !flightId) {
    return res
      .status(400)
      .json({ msg: "Missing Required Details to Reschedule Booking" });
  }

  try {
    const booking = await Booking.findOne({ bookingId, userId });

    if (!booking) {
      return res
        .status(404)
        .json({ msg: `Booking Not Found with Booking ID : ${bookingId}` });
    }

    if (booking.bookingStatus !== "Confirmed") {
      return res
        .status(404)
        .json({ msg: "Reschedule Only allowed for Confirmed Bookings" });
    }

    if (booking.cancellation?.isCancelled) {
      return res
        .status(400)
        .json({ msg: "Cancelled Booking Cannot be Rescheduled" });
    }

    const departureTime = new Date(
      `${booking.journey[0].from.date}T${booking.journey[0].from.time}`
    );

    const hoursLeft = (departureTime - new Date()) / (1000 * 60 * 60);

    if (hoursLeft < 3) {
      return res.status(400).json({
        msg: "Reschedule Not Allowed Less than 3 Hours Before Departure",
      });
    }

    const flightCache = await FlightCache.findOne({ sessionId });

    if (!flightCache) {
      return res.status(404).json({ msg: "Session Expired or Invalid" });
    }

    const selectedFlight = flightCache.data.find((flight) => {
      return flight.flightId === flightId;
    });

    if (!selectedFlight) {
      return res.status(404).json({ msg: "Flight Not Found Cache Session" });
    }

    // Build New Journey
    const buildNewJourney = (
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

    const newJourney = buildNewJourney(
      selectedFlight.outbound.segments,
      selectedFlight.class,
      selectedFlight.validatingAirline,
      selectedFlight.baggage,
      selectedFlight.outbound.stops,
      selectedFlight.outbound.duration
    );

    const newFareDetails = {
      baseFare: Number(selectedFlight.fare.baseFare),
      taxes: Number(selectedFlight.fare.taxes),
      instantDiscount: Number(selectedFlight.fare.instantDiscount || 0),
      totalFare: Number(selectedFlight.fare.totalFare),
      currency: selectedFlight.fare.currency || "INR",
    };

    const oldFare = booking.fareDetails.totalFare;
    const fareDifference = Math.max(newFareDetails.totalFare - oldFare, 0);

    booking.rescheduleHistory.push({
      rescheduledAt: new Date(),
      oldJourney: booking.journey,
      newJourney,
      fareDifference,
      updatedFareDetails: newFareDetails,
      rescheduledBy: userId,
    });

    booking.journey = newJourney;
    booking.fareDetails = newFareDetails;
    booking.isRescheduled = true;
    booking.bookingStatus = "Rescheduled";

    await booking.save();

    return res.status(200).json({
      msg: "Flight Rescheduled Successfully",
      bookingId,
      updatedJourney: newJourney,
      newFareDetails,
      fareDifference,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error Rescheduling Booking", error: error.message });
  }
}

module.exports = rescheduleBooking;
