const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");

// Generate Booking Reference ID
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const nanoid = customAlphabet(alphabet, 8);
function generateBookingId() {
  return `FLY${nanoid()}`;
}

// Individual Traveller Details
const travellerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  category: {
    type: String,
    enum: ["Adult", "Child", "Infant"],
    required: true,
  },
  seatPreference: {
    type: String,
    enum: ["No Preference", "Window", "Aisle", "Middle"],
    default: "No Preference",
  },
});

// Journey Details
const journeySchema = new mongoose.Schema({
  outbound: {
    segments: [
      {
        airlineCode: { type: String, required: true },
        airlineName: { type: String, required: true },
        flightNumber: { type: String, required: true },
        from: {
          date: { type: String, required: true },
          time: { type: String, required: true },
          cityCode: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          country: { type: String, required: true },
          airport: { type: String, required: true },
          terminal: { type: String, required: true },
        },
        to: {
          date: { type: String, required: true },
          time: { type: String, required: true },
          cityCode: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          country: { type: String, required: true },
          airport: { type: String, required: true },
          terminal: { type: String, required: true },
        },
      },
    ],
    duration: { type: String, required: true },
    stops: { type: Number, required: true },
  },
  returnTrip: {
    segments: [
      {
        airlineCode: { type: String, required: true },
        airlineName: { type: String, required: true },
        flightNumber: { type: String, required: true },
        from: {
          date: { type: String, required: true },
          time: { type: String, required: true },
          cityCode: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          country: { type: String, required: true },
          airport: { type: String, required: true },
          terminal: { type: String, required: true },
        },
        to: {
          date: { type: String, required: true },
          time: { type: String, required: true },
          cityCode: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          country: { type: String, required: true },
          airport: { type: String, required: true },
          terminal: { type: String, required: true },
        },
      },
    ],
    duration: { type: String },
    stops: { type: Number },
  },
  travelClass: {
    type: String,
    enum: ["ECONOMY", "PREMIUM ECONOMY", "BUSINESS", "FIRST"],
    required: true,
  },
  baggage: {
    cabin: { type: String, required: true },
    checkIn: { type: String, required: true },
  },
});

// Main Booking Schema
const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      default: generateBookingId,
      required: true,
      unique: true,
      index: true,
    },
    pnr: { type: String, unique: true, sparse: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tripType: { type: String, enum: ["Oneway", "Roundtrip"], required: true },
    journey: [journeySchema],

    isRescheduled: { type: Boolean, default: false },
    rescheduleHistory: [
      {
        rescheduledAt: { type: Date, default: Date.now },
        oldJourney: [journeySchema],
        newJourney: [journeySchema],
        fareDifference: { type: Number },
        updatedFareDetails: {
          baseFare: Number,
          taxes: Number,
          instantDiscount: Number,
          totalFare: Number,
          currency: String,
        },
        rescheduledBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    travellers: [travellerSchema],
    contactDetails: {
      email: { type: String, required: true },
      mobileNumber: {
        countryCode: { type: String },
        number: { type: String, required: true },
      },
    },
    billingAddress: {
      pincode: { type: Number, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    fareDetails: {
      baseFare: { type: Number, required: true },
      taxes: { type: Number, required: true },
      instantDiscount: { type: Number, default: 0 },
      totalFare: { type: Number, required: true },
      currency: { type: String, default: "INR" },
    },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Rescheduled"],
      default: "Pending",
    },
    bookingInitiatedAt: { type: Date, default: Date.now },
    bookingConfirmedAt: { type: Date },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Failed"],
      default: "Unpaid",
    },
    paymentDetails: {
      gateway: { type: String },
      orderId: { type: String, sparse: true },
      paymentId: { type: String, sparse: true },
      signature: { type: String, sparse: true },
      paidAt: { type: Date, sparse: true },
    },

    cancellation: {
      isCancelled: { type: Boolean, default: false },
      cancelledAt: { type: Date, sparse: true },
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        sparse: true,
      },
      reason: { type: String, sparse: true },
      refundAmount: { type: Number, sparse: true },
      refundStatus: {
        type: String,
        enum: ["Pending", "Processed", "Failed", "Not Applicable"],
        default: "Not Applicable",
      },
    },

    expiresAt: { type: Date },
  },
  { timestamps: true }
);

// TTL Index
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Quey Index
bookingSchema.index({ userId: 1, bookingStatus: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
