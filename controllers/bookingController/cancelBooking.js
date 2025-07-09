const Booking = require("../../models/booking/booking");
const sendEmail = require("../../utils/mailer"); // import your mailer

async function cancelBooking(req, res) {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

  const userId = req.user._id;
  const { bookingId, reason } = req.body || {};

  if (!bookingId || !userId || !reason) {
    return res
      .status(400)
      .json({ msg: "Missing Required Details to Cancel Booking" });
  }

  try {
    const booking = await Booking.findOne({ bookingId, userId });

    if (!booking) {
      return res
        .status(404)
        .json({ msg: `Booking Not Found with Booking ID : ${bookingId}` });
    }

    if (booking.expiresAt && booking.expiresAt < new Date()) {
      return res.status(400).json({ msg: "Booking Expired" });
    }

    if (booking.bookingStatus === "Cancelled") {
      return res.status(400).json({
        msg: `Booking Already Cancelled for Booking ID : ${bookingId}`,
      });
    }

    if (booking.bookingStatus === "Pending") {
      return res
        .status(400)
        .json({ msg: "Cancellation Not Allowed for Pending Bookings" });
    }

    const firstSegment = booking.journey?.[0].outbound?.segments?.[0];

    if (!firstSegment || !firstSegment.from?.date || !firstSegment.from?.time) {
      return res.status(400).json({ msg: "Invalid Journey Data" });
    }

    const departureTime = new Date(
      `${firstSegment.from.date}T${firstSegment.from.time}`
    );

    const hoursLeft = (departureTime - new Date()) / (1000 * 60 * 60);

    if (hoursLeft < 3) {
      return res.status(400).json({
        msg: "Cancellation Not Allowed Less than 3 Hours Before Departure",
      });
    }

    const totalFare = booking.fareDetails?.totalFare || 0;
    const refund =
      hoursLeft >= 24
        ? Math.round(totalFare * 0.8 * 100) / 100
        : Math.round(totalFare * 0.5 * 100) / 100;

    booking.bookingStatus = "Cancelled";
    booking.cancellation = {
      isCancelled: true,
      cancelledAt: new Date(),
      cancelledBy: userId,
      reason,
      refundAmount: refund,
      refundStatus: "Pending",
    };

    await booking.save();

    // ✅ Send Cancellation Email
    const emailResult = await sendEmail({
      to: booking.contactDetails.email,
      subject: `Flytix Booking Cancelled — ${booking.pnr}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: #e53935;">Your Booking Has Been Cancelled</h2>
          <p>Hello,</p>
          <p>Your booking with the following details has been successfully cancelled:</p>
          <ul>
            <li><strong>Booking ID:</strong> ${booking.bookingId}</li>
            <li><strong>PNR:</strong> ${booking.pnr}</li>
            <li><strong>Refund Amount:</strong> ₹${refund}</li>
            <li><strong>Reason:</strong> ${reason}</li>
            <li><strong>Cancelled On:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p style="margin-top: 12px;">The refund will be processed shortly to your original payment method.</p>
          <p>Thank you for choosing Flytix.</p>
        </div>
      `,
    });

    console.log("Cancellation email sent:", emailResult.status);

    return res.status(200).json({
      msg: "Booking Cancelled Successfully",
      bookingId: booking.bookingId,
      pnr: booking.pnr,
      refundAmount: refund,
      cancellationDetails: booking.cancellation,
    });
  } catch (error) {
    console.error("Cancellation Error:", error);
    res
      .status(500)
      .json({ msg: "Error cancelling booking", error: error.message });
  }
}

module.exports = cancelBooking;
