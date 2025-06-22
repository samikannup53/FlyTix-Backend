const User = require("../models/user/userModel");
const verifyToken = require("../utils/verifyToken");

async function authUser(req, res, next) {
  const userAuthToken = req.cookies.userAuthToken;

  if (!userAuthToken) {
    return res.status(401).json({ msg: "Access Denied, No Token Provided" });
  }

  const { valid, payload, error } = verifyToken(userAuthToken);

  if (!valid) {
    console.log("JWT Verification Failed :", error.message);
    return res
      .status(401)
      .json({ msg: "Invalid or Expired Token, Please Login Again" });
  }
  try {
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res.status(401).json({ msg: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
}

module.exports = authUser;
