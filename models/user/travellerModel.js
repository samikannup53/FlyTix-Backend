const mongoose = reuire("mongoose");

const travellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    catagory: {
      type: String,
      enum: ["Adult", "Child", "Infant"],
      required: true,
    },
  },
  { timestamps: true }
);

const Traveller = mongoose.model("Traveller", travellerSchema);

module.exports = Traveller;
