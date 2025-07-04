const airportData = require("../../data/airports.json");

function getAirports(req, res) {
  const search = req.query.search?.toLowerCase() || "";

  const allAirports = Object.entries(airportData).map(
    ([iataCode, airportDetails]) => ({
      iataCode,
      city: airportDetails.city,
      name: airportDetails.name,
      country: airportDetails.country,
      state: airportDetails.state,
    })
  );

  const filtered = allAirports.filter((airport) =>
    airport.iataCode.toLowerCase().includes(search) ||
    airport.city.toLowerCase().includes(search) ||
    airport.name.toLowerCase().includes(search) ||
    airport.state.toLowerCase().includes(search)
  );

  const sorted = filtered.sort((a, b) => a.city.localeCompare(b.city));
  const limited = sorted.slice(0, 10);

  res.json(limited);
}

module.exports = getAirports;
