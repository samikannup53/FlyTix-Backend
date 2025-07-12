const User = require("../../models/user/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../../utils/generateToken");

async function loginUser(req, res) {
  const { email, password } = req.body || {};

  try {
    // Input Validation
    if (!email) {
      return res.status(400).json({ msg: "Email is Required" });
    }
    if (!password) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    // User Validation
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    // Password Validation
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    // Create Token
    const userAuthToken = generateToken(user._id, user.role);

    // Send Token via Cookie
    res
      .cookie("userAuthToken", userAuthToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ msg: "Login Successful" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
}

module.exports = loginUser;
