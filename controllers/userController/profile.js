const User = require("../../models/user/userModel");

async function getUserProfile(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    const user = req.user;

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile || "",
      dob: user.dob,
      gender: user.gender,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Failed to Fetch User Profile", error: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    const userId = req.user._id;

    const { fullName, mobile, dob, gender } = req.body || {};

    if (!fullName || !mobile || !dob || !gender) {
      return res.status(400).json({ msg: "All Fields are Required" });
    }

    if (isNaN(new Date(dob))) {
      return res.status(400).json({ msg: "Invalid date of birth" });
    }

    const updates = {
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      dob,
      gender: gender.trim(),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    res.status(200).json({
      msg: "Profile Updated Successfully",
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        dob: updatedUser.dob,
        gender: updatedUser.gender,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Failed to Update Profile", error: error.message });
  }
}

module.exports = { getUserProfile, updateProfile };
