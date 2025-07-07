const Booking = require("../../models/booking/booking");
const razorpay = require("../../utils/razorPayInstance");

async function initiatePayment(req, res) {
  // Validate Authenticated User
  if (!req.user || !req.user._id) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

  const userId = req.user._id;

  const { bookingId } = req.body || {};

  if (!bookingId) {
    return res.status(400).json({ msg: "Booking ID Required" });
  }

  try {
    const booking = await Booking.findOne({ bookingId, userId });

    if (!booking) {
      return res
        .status(404)
        .json({ msg: "Booking Request Expired, Please Initiate New Booking" });
    }

    if (booking.paymentStatus === "Paid") {
      return res.status(400).json({ msg: "Payment Already Done" });
    }

    const amount = Math.round(booking.fareDetails.totalFare * 100);

    const options = {
      amount,
      currency: "INR",
      receipt: booking.bookingId,
      notes: {
        bookingId: booking.bookingId,
        userId: booking.userId.toString(),
      },
    };

    const paymentOrder = await razorpay.orders.create(options);

    res.status(200).json({
      msg: "Payment Order Created Successfully",
      razorPayOrderId: paymentOrder.id,
      amount,
      currency: options.currency,
      booking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Failed to initiate payment", error: error.message });
  }
}

module.exports = initiatePayment;
