const path = require("path");
const fs = require("fs");
const generatePDF = require("../../utils/pdfGenerator");
const Booking = require("../../models/booking/booking");

const generateTicket = async (req, res) => {
  try {
    // Step 1: Authentication Check
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    const userId = req.user._id;
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ msg: "Invalid Booking ID" });
    }

    // Step 2: Fetch only user’s booking
    const booking = await Booking.findOne({ bookingId, userId });
    if (!booking) {
      return res
        .status(404)
        .json({ msg: "Booking not found or access denied" });
    }

    // Step 3: Prepare ticket data
    const trip = booking.journey[0];
    const outboundSegments = trip.outbound.segments;
    const returnSegments = trip.returnTrip?.segments || null;

    const getFlightInfo = (segments, tripData) => {
      if (!segments?.length) return null;
      const first = segments[0];
      const last = segments[segments.length - 1];

      return {
        airlineCode: first.airlineCode,
        airlineName: first.airlineName,
        airlineLogo: `https://images.ixigo.com/img/common-resources/airline-new/${first.airlineCode}.png`,
        flightNumber: first.flightNumber,
        departureTime: first.from?.time,
        departureCity: first.from?.city,
        departureCode: first.from?.cityCode,
        departureDate: first.from?.date,
        arrivalTime: last.to?.time,
        arrivalCity: last.to?.city,
        arrivalCode: last.to?.cityCode,
        duration: tripData.duration,
        stops: tripData.stops === 0 ? "Non-stop" : `${tripData.stops} Stop(s)`,
      };
    };

    const outboundInfo = getFlightInfo(outboundSegments, trip.outbound);
    const returnFlightInfo = returnSegments
      ? getFlightInfo(returnSegments, trip.returnTrip)
      : null;

    const ticketData = {
      bookingId: booking.bookingId,
      bookingConfirmedAt: booking.bookingConfirmedAt
        .toISOString()
        .split("T")[0],
      pnr: booking.pnr,
      status: booking.bookingStatus || "Confirmed",
      tripType: booking.tripType,
      travelClass: booking.travelClass,
      email: booking.contactDetails.email,
      mobile: booking.contactDetails.phone,
      fare: `${booking.fareDetails.currency} ${booking.fareDetails.totalFare}`,
      baggage: trip.baggage,
      passengers: booking.travellers.map((t) => ({
        name: `${t.title} ${t.firstName} ${t.lastName}`,
        age: t.age,
        gender:
          t.gender.charAt(0).toUpperCase() + t.gender.slice(1).toLowerCase(),
        category: t.category,
      })),
      outboundInfo,
      returnFlightInfo,
    };

    const pdfPath = path.join(__dirname, `../../tickets/${booking.pnr}.pdf`);

    await generatePDF(ticketData, pdfPath);

    const fileStream = fs.createReadStream(pdfPath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="Flytix-Ticket-${booking.pnr}.pdf"`
    );
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error generating ticket:", error);
    res
      .status(500)
      .json({ msg: "Error generating ticket", error: error.message });
  }
};

module.exports = generateTicket;
