const Traveller = require("../../models/user/travellerModel");

async function getSavedTravellers(req, res) {
  try {
    // Validate Authenticated User
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    const userId = req.user._id;

    const travellers = await Traveller.find({ userId });

    if (!travellers || travellers.length === 0) {
      return res
        .status(200)
        .json({ msg: "No Saved Travellers Found for this User" });
    }

    res.status(200).json({
      msg: "Saved Travellers Fetched Successfully",
      totalSavedTravellers: travellers.length,
      travellers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Failed to Fetch Saved Travellers", error: error.message });
  }
}

// async function addToSavedTraveller(req, res) {
//   res.json({ msg: "addToSavedTravellers Route is Working" });
// }

// async function deleteSavedTraveller(req, res) {
//   res.json({ msg: "deleteSavedTraveller Route is Working" });
// }

module.exports = {
  getSavedTravellers,
  addToSavedTraveller,
  deleteSavedTraveller,
};
