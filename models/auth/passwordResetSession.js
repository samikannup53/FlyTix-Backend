const mongoose = require("mongoose");

const passwordResetSessionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

const PasswordResetSession = mongoose.model(
  "PasswordResetSession",
  passwordResetSessionSchema
);

module.exports = PasswordResetSession;
