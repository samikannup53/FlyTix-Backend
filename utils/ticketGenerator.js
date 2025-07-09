const path = require("path");
const generatePDF = require("./pdfGenerator");

async function generateTicketPDF(booking) {
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
    bookingConfirmedAt: booking.bookingConfirmedAt.toISOString().split("T")[0],
    pnr: booking.pnr,
    status: booking.bookingStatus,
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

  const pdfPath = path.join(__dirname, `../tickets/${booking.pnr}.pdf`);
  await generatePDF(ticketData, pdfPath);

  return pdfPath;
}

module.exports = generateTicketPDF;
