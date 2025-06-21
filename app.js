// Import Necessary Files and Modules
const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Register Routes

app.get("/", (req, res) => {
  res.send("FlyTix API Running .....");
});

module.exports = app;
