// Import Necessary Files and Modules
const express = require("express");
const cors = require("cors");
const app = express();

// Importing Routes
const authRoutes = require("./routes/authRoutes");

// Middlewares
app.use(cors());
app.use(express.json());

// Register Routes
app.use("/api/auth", authRoutes);

module.exports = app;
