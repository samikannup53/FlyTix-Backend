// User Logout
function logoutUser(req, res) {
  res
    .clearCookie("userAuthToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    })
    .status(200)
    .json({ msg: "Logout Successful" });
}

module.exports = logoutUser;
