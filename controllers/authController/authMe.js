// Get Logged in User
function getLoggedInUser(req, res) {
  res.status(200).json({ msg: "User Loggedin", user: req.user });
}

module.exports = getLoggedInUser;
