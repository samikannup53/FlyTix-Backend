const bcrypt = require("bcrypt");
const User = require("../../models/user/userModel");

async function changePassword(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    const userId = req.user._id;

    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Both Current and New Passwords are Required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ msg: "New Password must be Minimum 8 Characters" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Current Password Mismatch" });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);

    if (isSame) {
      return res
        .status(400)
        .json({ msg: "New Password must be different from Current Password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ msg: "Password Changed Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Failed to Update Password", error: error.message });
  }
}

module.exports = changePassword;
