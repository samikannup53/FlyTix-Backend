const getAmadeusToken = require("../../utils/amadeusToken");
const FlightCache = require("../../models/flight/flightCache");
const { v4: uuidv4 } = require("uuid");

async function searchFlights(req, res) {
  const {
    from,
    to,
    date,
    returnDate,
    travelClass = "ECONOMY",
    adults = 1,
    children = 0,
    infants = 0,
  } = req.query;

  if (!from || !to || !date) {
    return res
      .status(400)
      .json({ msg: "Missing Required Fields : From, To & Date and all" });
  }

  try {
    const amadeusToken = await getAmadeusToken();

    const params = new URLSearchParams({
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: date,
      travelClass,
      adults: parseInt(adults),
      children: parseInt(children),
      infants: parseInt(infants),
      max: 10,
    });

    if (returnDate) {
      params.append("returnDate", returnDate);
    }

    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?${params.toString()}`;

    const flightResults = await fetch(url, {
      headers: { Authorization: `Bearer ${amadeusToken}` },
    });

    const flightResultsData = await flightResults.json();

    if (flightResultsData.errors) {
      return res.status(500).json({ error: flightResultsData.errors });
    }

    // Generate Session ID
    const sessionId = uuidv4();

    // Save full Amadeus Response to Cache
    await FlightCache.create({
      sessionId,
      userId: req.user?.id || null,
      data: flightResultsData.data,
    });

    // Send Summarized Data with Session ID to Frontend
    res.json({
      sessionId,
      results: flightResultsData,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
}

module.exports = searchFlights;
