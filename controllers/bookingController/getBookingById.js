const Booking = require("../../models/booking/booking");

async function getBookingById(req, res) {
  res.json({ msg: "Booking By ID Route working ......" });
}

module.exports = getBookingById;
