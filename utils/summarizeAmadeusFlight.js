function formatSegment(segment) {
  return {
    airlineCode: segment.carrierCode,
    flightNumber: `${segment.carrierCode}-${segment.number}`,

    departure: {
      date: segment.departure?.at.split("T")[0],
      time: segment.departure?.at.split("T")[1],
      cityCode: segment.departure.iataCode,
      airport: segment.departure.airportName || "N/A",
      terminal: segment.departure.terminal || "N/A",
    },

    arrival: {
      date: segment.arrival?.at.split("T")[0],
      time: segment.arrival?.at.split("T")[1],
      cityCode: segment.arrival.iataCode,
      airport: segment.arrival.airportName || "N/A",
      terminal: segment.arrival.terminal || "N/A",
    },
  };
}

function summarizeAmadeusFlight(flight, meta = {}) {
  const outbound = flight.itineraries[0];
  const returnTrip = flight.itineraries[1] || null;

  const pricing = flight.travelerPricings?.[0] || {};
  const fareDetails = pricing.fareDetailsBySegment?.[0] || {};

  const baseFare = parseFloat(flight.price.base);
  const totalFare = parseFloat(flight.price.total);
  const taxes = (totalFare - baseFare).toFixed(2);

  return {
    id: flight.id,
    validatingAirline: flight.validatingAirlineCodes?.[0] || "N/A",

    outbound: {
      segments: outbound.segments.map(formatSegment),
      duration: outbound.duration,
      stops: outbound.segments.length - 1,
    },

    returnTrip: returnTrip
      ? {
          segments: returnTrip.segments.map(formatSegment),
          duration: returnTrip.duration,
          stops: returnTrip.segments.length - 1,
        }
      : null,

    class: fareDetails.cabin || "ECONOMY",

    baggage: {
      cabin: fareDetails.includedCabinBags?.weight
        ? ` ${fareDetails.includedCabinBags.weight} ${fareDetails.includedCabinBags.weightUnit} per Adult `
        : "7 Kg per Adult",
      checkIn: fareDetails.includedCheckedBags?.weight
        ? ` ${fareDetails.includedCheckedBags.weight} ${fareDetails.includedCheckedBags.weightUnit} per Adult `
        : "15 Kg per Adult",
    },

    fare: {
      baseFare: baseFare.toFixed(2),
      taxes,
      instantDiscount: 0,
      totalFare: totalFare.toFixed(2),
      currency: flight.price.currency,
    },

    passengers: {
      adults: meta.adults || 1,
      children: meta.children || 0,
      infants: meta.infants || 0,
    },

    returnDate: meta.returnDate || null,
    refundable: pricing.refundPolicy || "Not Specified",
    lastTicketingDate: flight.lastTicketingDate,
  };
}

module.exports = summarizeAmadeusFlight;
