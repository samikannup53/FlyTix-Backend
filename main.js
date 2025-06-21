// Importing Necessary Files and Modules
require("dotenv").config();
const app = require("./app");
port = process.env.PORT;

// MongoDB Connection

// Server
app.listen(port, () => {
  console.log(
    `Server Running on Port : ${port}, URL : http://localhost:${port}`
  );
});
