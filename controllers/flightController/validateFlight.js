const FlightCache = require("../../models/flight/flightCache");

async function validateFlight(req, res) {
  const { flightId } = req.body || {};
  const sessionId = req.cookies.sessionId;

  if (!sessionId || !flightId) {
    return res.status(400).json({ msg: "Missing sessionId or flightId" });
  }

  try {
    const cached = await FlightCache.findOne({ sessionId });
    if (!cached) {
      return res.status(404).json({ msg: "Session Expired or Invalid" });
    }

    const flight = cached.data.find((flight) => {
      return flight.flightId === flightId;
    });
    if (!flight) {
      return res
        .status(404)
        .json({ msg: "Flight Not Found, Please Try Again" });
    }
    res.json({ flight });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
}

module.exports = validateFlight;
