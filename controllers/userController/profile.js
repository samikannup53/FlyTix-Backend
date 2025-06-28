async function getUserProfile(req, res) {
  res.json({ msg: "Get User Profile Route is working" });
}

async function updateProfile(req, res) {
  res.json({ msg: "Update Profile Route is working" });
}

module.exports = { getUserProfile, updateProfile };
