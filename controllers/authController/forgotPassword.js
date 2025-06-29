const User = require("../../models/user/userModel");
const PasswordResetSession = require("../../models/auth/passwordResetSession");
const generateOTP = require("../../utils/otpGenerator");
const sendEmail = require("../../utils/mailer");

async function initiateForgotPassword(req, res) {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ msg: "Email is Required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PasswordResetSession.deleteMany({ email });

    await PasswordResetSession.create({ email, otp, expiresAt });

    const sendEmailResponse = await sendEmail({
      to: email,
      subject: "OTP Generated",
      text: `Your OTP for FlyTix Account Password Reset is ${otp}. It will expire in 10 Minutes. For Security Reasons Dont Share it with Anyone`,
    });

    if (sendEmailResponse.status !== 200) {
      return res
        .status(500)
        .json({ msg: "Failed to send OTP", error: sendEmailResponse.error });
    }

    return res.status(200).json({ msg: "OTP Sent Successfully to Your Email" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
}

module.exports = { initiateForgotPassword };
