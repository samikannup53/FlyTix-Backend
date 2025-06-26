// Import Necessary Files and Modules
const express = require("express");
const cors = require("cors");
const app = express();

// Importing Routes
const authRoutes = require("./routes/authRoutes");
const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Middlewares
app.use(cors());
app.use(express.json());

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/booking", bookingRoutes);

module.exports = app;
