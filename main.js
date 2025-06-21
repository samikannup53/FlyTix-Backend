// Importing Necessary Files and Modules
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/dbConfig");
port = process.env.PORT;

// MongoDB Connection
connectDB();

// Server
app.listen(port, () => {
  console.log(
    `Server Running on Port : ${port}, URL : http://localhost:${port}`
  );
});
