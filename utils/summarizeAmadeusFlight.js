const airportData = require("../data/airports.json");
const airlineData = require("../data/airlines.json");

function getAirportDetails(iataCode) {
  const airport = airportData[iataCode];
  return {
    airportName: airport?.name || "N/A",
    city: airport?.city || "N/A",
    state: airport?.state || "N/A",
    country: airport?.country || "N/A",
  };
}

function getAirlineName(code) {
  const airline = airlineData.find((a) => a.code === code);
  return airline ? airline.name : "Unknown Airline";
}

function formatDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = match?.[1] ? parseInt(match[1], 10) : 0;
  const minutes = match?.[2] ? parseInt(match[2], 10) : 0;

  let result = "";
  if (hours > 0) result += `${hours}H `;
  if (minutes > 0) result += `${minutes}M`;
  return result.trim() || "0M";
}

function formatSegment(segment) {
  const departureDetails = getAirportDetails(segment.departure.iataCode);
  const arrivalDetails = getAirportDetails(segment.arrival.iataCode);

  return {
    airlineCode: segment.carrierCode,
    airlineName: getAirlineName(segment.carrierCode),
    flightNumber: `${segment.carrierCode}-${segment.number}`,

    departure: {
      date: segment.departure?.at.split("T")[0],
      time: segment.departure?.at.split("T")[1],
      cityCode: segment.departure.iataCode,
      city: departureDetails.city,
      state: departureDetails.state,
      country: departureDetails.country,
      airport: departureDetails.airportName,
      terminal: segment.departure.terminal || "N/A",
    },

    arrival: {
      date: segment.arrival?.at.split("T")[0],
      time: segment.arrival?.at.split("T")[1],
      cityCode: segment.arrival.iataCode,
      city: arrivalDetails.city,
      state: arrivalDetails.state,
      country: arrivalDetails.country,
      airport: arrivalDetails.airportName,
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

  const validatingAirlineCode = flight.validatingAirlineCodes?.[0] || "N/A";

  return {
    flightId: flight.id,
    validatingAirline: validatingAirlineCode,

    outbound: {
      segments: outbound.segments.map((segment) => {
        return formatSegment(segment);
      }),
      duration: formatDuration(outbound.duration),
      stops: outbound.segments.length - 1,
    },

    returnTrip: returnTrip
      ? {
          segments: returnTrip.segments.map((segment) => {
            return formatSegment(segment);
          }),
          duration: formatDuration(returnTrip.duration),
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
