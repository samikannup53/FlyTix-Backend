const mongoose = require("mongoose");

const flightCacheSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  data: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 },
});

const FlightCache = mongoose.model("FlightCache", flightCacheSchema);

module.exports = FlightCache;
