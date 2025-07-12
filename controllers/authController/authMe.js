// Get Logged in User
function getLoggedInUser(req, res) {
  res.status(200).json({ msg: "User Loggedin", user: req.user });
}

console.log("Received cookies:", req.cookies);

module.exports = getLoggedInUser;
