const airportData = require("../../data/airports.json");

async function getAirports(req, res) {
  const search = req.query.search?.toLowerCase() || "";

  const results = Object.entries(airportData)
    .map(([iataCode, airportDetails]) => {
      return { iataCode, city: airportDetails.city, name: airportDetails.name };
    })
    .filter((airport) => {
      return (
        airport.iataCode.toLowerCase().includes(search) ||
        airport.city.toLowerCase.includes(search) ||
        airport.name.toLowerCase.includes(search)
      );
    });
  res.json(results);
}

module.exports = getAirports;
