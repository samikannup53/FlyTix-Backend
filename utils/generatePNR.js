const Booking = require("../models/booking/booking");

function generatePNR() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let pnr = "";

  pnr = pnr + numbers[Math.floor(Math.random() * numbers.length)];

  for (let i = 0; i < 2; i++) {
    pnr = pnr + letters[Math.floor(Math.random() * letters.length)];
  }

  for (let i = 0; i < 3; i++) {
    pnr = pnr + numbers[Math.floor(Math.random() * numbers.length)];
  }

  return pnr;
}

async function generateUniquePNR() {
  let uniquePNR = "";
  let isTaken = true;

  while (isTaken) {
    uniquePNR = generatePNR();
    isTaken = await Booking.exists({ pnr: uniquePNR });
  }

  return uniquePNR;
}

module.exports = generateUniquePNR;
