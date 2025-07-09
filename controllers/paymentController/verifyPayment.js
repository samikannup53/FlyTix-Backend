const crypto = require("crypto");
const Booking = require("../../models/booking/booking");
const generatePNR = require("../../utils/generatePNR");
const generateTicketPDF = require("../../utils/ticketGenerator");
const sendEmail = require("../../utils/mailer");

async function verifyPayment(req, res) {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

  const userId = req.user._id;
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = req.body || {};

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !bookingId
  ) {
    return res
      .status(400)
      .json({ msg: "Missing Required Fields, Payment Verification Failed" });
  }

  try {
    const booking = await Booking.findOne({ bookingId, userId });

    if (!booking) {
      return res
        .status(404)
        .json({ msg: "Booking Request Expired, Please Initiate New Booking" });
    }

    if (booking.paymentStatus === "Paid") {
      return res.status(200).json({ msg: "Payment Already Verified" });
    }

    const signatureBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signatureBody)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ msg: "Invalid Signature, Payment Verification Failed" });
    }

    // Update booking only if not already paid
    if (
      booking.paymentStatus === "Unpaid" ||
      booking.paymentStatus === "Failed"
    ) {
      const pnr = await generatePNR();

      booking.paymentStatus = "Paid";
      booking.bookingStatus = "Confirmed";
      booking.pnr = pnr;
      booking.bookingConfirmedAt = new Date();

      booking.paymentDetails = {
        gateway: "Razorpay",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        paidAt: new Date(),
      };

      booking.expiresAt = undefined;
      await booking.save();

      // Generate PDF Ticket
      const pdfPath = await generateTicketPDF(booking);

      // Send Confirmation Email with Ticket Attachment
      await sendEmail({
        to: booking.contactDetails.email,
        subject: `Flytix Booking Confirmed - PNR ${pnr}`,
        text: `Dear ${booking.travellers[0].firstName},\n\nYour booking has been successfully confirmed.\nPNR: ${pnr}\n\nPlease find your e-ticket attached.\n\nThank you for choosing Flytix.`,
        html: `<p>Dear <strong>${booking.travellers[0].firstName}</strong>,</p>
               <p>Your booking has been <strong>confirmed</strong> successfully.</p>
               <p><strong>PNR:</strong> ${pnr}</p>
               <p>Please find your e-ticket attached.</p>
               <p>Thank you for choosing <strong>Flytix</strong>!</p>`,
        // Attach the ticket
        attachments: [
          {
            filename: `Flytix-Ticket-${pnr}.pdf`,
            path: pdfPath,
          },
        ],
      });
    } else {
      return res.status(400).json({
        msg: "Payment already Verified or Cannot be updated due to Status Mismatch",
        bookingId: booking.bookingId,
        bookingStatus: booking.bookingStatus,
      });
    }

    res.status(200).json({
      msg: "Payment Success & Booking Confirmed",
      bookingId: booking.bookingId,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      pnr: booking.pnr,
      journey: booking.journey,
      travellers: booking.travellers,
      contactDetails: booking.contactDetails,
      billingAddress: booking.billingAddress,
      fareDetails: booking.fareDetails,
      bookingConfirmedAt: booking.bookingConfirmedAt,
      paymentDetails: booking.paymentDetails,
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res
      .status(500)
      .json({ msg: "Payment verification failed", error: error.message });
  }
}

module.exports = verifyPayment;
