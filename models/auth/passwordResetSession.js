const mongoose = require("mongoose");

const passwordResetSessionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

passwordResetSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const PasswordResetSession = mongoose.model(
  "PasswordResetSession",
  passwordResetSessionSchema
);

module.exports = PasswordResetSession;
