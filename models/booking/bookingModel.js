const mongoose = require("mongoose");

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
    required: false,
  },
});

// Journey Details
const journeySchema = new mongoose.Schema({
  from: {
    city: { type: String, required: true },
    airport: { type: String, required: false },
    terminal: { type: Number, required: false },
    dateTime: { type: Date, required: true },
  },
  to: {
    city: { type: String, required: true },
    airport: { type: String, required: false },
    terminal: { type: Number, required: false },
    dateTime: { type: Date, required: true },
  },
  class: {
    type: String,
    enum: ["Economy", "Premium Economy", "Business", "First"],
    required: true,
  },
  stops: { type: Number, required: true },
  duration: { type: String, required: true },
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  baggage: {
    cabin: { type: String, required: false },
    checkIn: { type: String, required: false },
  },
});

// Main Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tripType: { type: String, enum: ["Oneway", "Roundtrip"], required: true },
  journey: [journeySchema],
  travellers: [travellerSchema],
  contactDetails: {
    email: { type: String, required: true },
    mobileNumber: {
      countryCode: { type: String, required: false },
      number: { type: Number, required: true },
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
    taxesAndFees: { type: Number, required: true },
    instantDiscount: { type: Number, default: 0 },
    totalFare: { type: Number, required: true },
  },
  bookingStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Paid", "Failed"],
    default: "Unpaid",
  },
  bookedAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
