// Import Mongoose
const mongoose = require("mongoose");

// DB Connection Function
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected : ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in MongoDB Connection :", error.message);
    process.exit(1);
  }
}

// Export DB Connection Function
module.exports = connectDB;
