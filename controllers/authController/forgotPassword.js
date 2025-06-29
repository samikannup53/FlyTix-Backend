const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user/userModel");
const PasswordResetSession = require("../../models/auth/passwordResetSession");
const generateOTP = require("../../utils/otpGenerator");
const sendEmail = require("../../utils/mailer");
const verifyToken = require("../../utils/verifyToken");

// Initiate Forgot Password with JWT
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

    await PasswordResetSession.deleteMany({ email });

    await PasswordResetSession.create({ email, otp });

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

    const resetSessionToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10m",
      issuer: "FlyTix",
    });

    res
      .cookie("resetSessionToken", resetSessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 10 * 60 * 1000,
      })
      .status(200)
      .json({ msg: "OTP Sent Successfully to Your Email" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
}

// Validate OTP, JWT and Updaet Password
async function validateAndResetPassword(req, res) {
  try {
    const { otp, newPassword } = req.body || {};

    if (!otp || !newPassword) {
      return res.status(400).json({ msg: "All Fields are Required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ msg: "New Password Must be Minimum 8 Characters" });
    }
    const resetSessionToken = req.cookies.resetSessionToken;

    if (!resetSessionToken) {
      return res.status(401).json({ msg: "Session Expired or Invalid" });
    }

    const { valid, payload, error } = verifyToken(resetSessionToken);

    if (!valid) {
      return res.status(401).json({
        msg: "Invalid or Expired Token, Please Login Again",
        error: error.message,
      });
    }

    const email = payload.email;

    const passwordResetSession = await PasswordResetSession.findOne({ email });

    if (!passwordResetSession) {
      return res.status(400).json({ msg: "Session Expired or Invalid" });
    }

    if (passwordResetSession.otp !== otp) {
      return res.status(400).json({ msg: "OTP Mismatch" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);

    if (isSame) {
      return res
        .status(400)
        .json({ msg: "New Password must be different from Old Password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne({ email }, { password: hashedNewPassword });

    await PasswordResetSession.deleteMany({ email });

    res
      .clearCookie("resetSessionToken")
      .status(200)
      .json({ msg: "Password Reset Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
}

// Resend OTP Functionality
async function resendOtpForForgotPassword(req, res) {
  try {
    const resetSessionToken = req.cookies.resetSessionToken;

    if (!resetSessionToken) {
      return res.status(401).json({ msg: "Session Expired or Invalid" });
    }

    const { valid, payload, error } = verifyToken(resetSessionToken);

    if (!valid) {
      return res
        .status(401)
        .json({ msg: "Invalid or Expired Token", error: error.message });
    }

    const email = payload.email;

    const recentOtp = await PasswordResetSession.findOne({ email });

    if (recentOtp && Date.now() - recentOtp.createdAt.getTime() < 60 * 1000) {
      return res
        .status(429)
        .json({ msg: "Please wait 60 Seconds Before Requesting New OTP" });
    }

    await PasswordResetSession.deleteMany({ email });

    const otp = generateOTP();

    await PasswordResetSession.create({ email, otp });

    const sendEmailResponse = await sendEmail({
      to: email,
      subject: "OTP Regenerated",
      text: `Your OTP for FlyTix Account Password Reset is ${otp}. It will expire in 10 Minutes. For Security Reasons Dont Share it with Anyone.`,
    });

    if (sendEmailResponse.status !== 200) {
      return res
        .status(500)
        .json({ msg: "Failed to Resend OTP", error: sendEmailResponse.error });
    }
    res.status(200).json({ msg: "OTP Re-Sent Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  initiateForgotPassword,
  validateAndResetPassword,
  resendOtpForForgotPassword,
};
