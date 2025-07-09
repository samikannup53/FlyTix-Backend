const fs = require("fs");
const Booking = require("../../models/booking/booking");
const generateTicketPDF = require("../../utils/ticketGenerator");

const generateTicket = async (req, res) => {
  try {
    // Step 1: Authentication Check
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    const userId = req.user._id;
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ msg: "Invalid Booking ID" });
    }

    // Step 2: Fetch only user’s booking
    const booking = await Booking.findOne({ bookingId, userId });
    if (!booking) {
      return res
        .status(404)
        .json({ msg: "Booking not found or access denied" });
    }

    // Step 3: Generate the ticket PDF using the utility
    const pdfPath = await generateTicketPDF(booking);

    // Step 4: Stream the PDF file
    const fileStream = fs.createReadStream(pdfPath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="Flytix-Ticket-${booking.pnr}.pdf"`
    );
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error generating ticket:", error);
    res
      .status(500)
      .json({ msg: "Error generating ticket", error: error.message });
  }
};

module.exports = generateTicket;
