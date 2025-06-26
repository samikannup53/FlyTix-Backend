const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

// Generate Booking Reference ID
function generateBookingReferenceId() {
  const id = nanoid(8).toUpperCase();
  return `FLY-${id}`;
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
  from: {
    city: { type: String, required: true },
    airport: { type: String, required: true },
    terminal: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  to: {
    city: { type: String, required: true },
    airport: { type: String, required: true },
    terminal: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  flightNumber: { type: String, required: true },
  airline: { type: String, required: true },
  duration: { type: String, required: true },
  stops: { type: Number, required: true },
  travelClass: {
    type: String,
    enum: ["Economy", "Premium Economy", "Business", "First"],
    required: true,
  },
  baggage: {
    cabin: { type: String, required: true },
    checkIn: { type: String, required: true },
  },
});

// Main Booking Schema
const bookingSchema = new mongoose.Schema({
  bookingReferenceId: {
    type: String,
    default: generateBookingReferenceId,
    required: true,
    unique: true,
    index: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tripType: { type: String, enum: ["Oneway", "Roundtrip"], required: true },
  journey: [journeySchema],
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
    taxesAndFees: { type: Number, required: true },
    instantDiscount: { type: Number, default: 0 },
    totalFare: { type: Number, required: true },
    currency: { type: String, default: "INR" },
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
  bookingInitiatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

// TTL Index
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
