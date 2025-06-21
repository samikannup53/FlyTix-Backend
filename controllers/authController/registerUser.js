const bcrypt = require("bcrypt");
const User = require("../../models/user/userModel");

async function registerUser(req, res) {
  const { fullName, email, dob, gender, password, termsAccepted } = req.body;

  try {
    // Validation
    if (!fullName) {
      return res.status(400).json({ msg: "Full Name is Required" });
    }
    if (!email) {
      return res.status(400).json({ msg: "Email is Required" });
    }
    if (!dob) {
      return res.status(400).json({ msg: "DOB is Required" });
    }
    if (!gender) {
      return res.status(400).json({ msg: "Gender is Required" });
    }
    if (!password && password.length < 8) {
      return res
        .status(400)
        .json({ msg: "Password is Required with Minimum 8 Characters" });
    }
    if (!termsAccepted) {
      return res
        .status(400)
        .json({ msg: "Please Accept the Terms and Conditions" });
    }

    // Normalize Email
    const normalizedEmail = email.toLowerCase();

    // Validate Existing User
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ msg: "User Already Exists" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create New User
    const newUser = new User({
      fullName,
      email: normalizedEmail,
      dob,
      gender,
      password: hashedPassword,
      termsAccepted,
    });

    await newUser.save();
    res.status(201).json({ msg: "User Created Successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
}

module.exports = registerUser;
