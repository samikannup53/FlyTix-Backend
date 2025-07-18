const getAmadeusToken = require("../../utils/amadeusToken");
const FlightCache = require("../../models/flight/flightCache");
const summarizeAmadeusFlight = require("../../utils/summarizeAmadeusFlight");
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
  } = req.body || {};

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
      max: "100",
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
      console.error(flightResultsData.errors);
      return res
        .status(500)
        .json({ msg: "Amadeus API error", details: flightResultsData.errors });
    }

    // Generate Session ID
    const sessionId = uuidv4();

    const summarized = flightResultsData.data.map((flight) =>
      summarizeAmadeusFlight(flight, {
        returnDate,
        adults: parseInt(adults),
        children: parseInt(children),
        infants: parseInt(infants),
      })
    );

    // Save full Amadeus Response to Cache
    await FlightCache.create({
      sessionId,
      userId: req.user?.id || null,
      data: summarized,
    });

    // Send Session ID in Cookie
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });

    // Send Summarized Data with Session ID to Frontend
    res.json({
      userId: req.user?.id || null,
      data: summarized,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
    console.error(error);
  }
}

module.exports = searchFlights;
