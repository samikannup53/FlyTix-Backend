// Import Traveller Model
const Traveller = require("../../models/user/travellerModel");

// Get Saved Travellers
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

// Add New Traveller
async function addToSavedTraveller(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }
    const userId = req.user._id;

    const { title, firstName, lastName, age, gender, category } =
      req.body || {};

    if (!title || !firstName || !lastName || !age || !gender || !category) {
      return res.status(400).json({ msg: "All Fields are Required" });
    }
    const existingTraveller = await Traveller.findOne({
      userId,
      firstName,
      lastName,
      age,
      gender,
      category,
    });

    if (existingTraveller) {
      return res.status(409).json({ msg: "Traveller Already Exist" });
    }

    const newTraveller = await Traveller.create({
      userId,
      title,
      firstName,
      lastName,
      age,
      gender,
      category,
    });

    res
      .status(201)
      .json({ msg: "Traveller Saved Successfully", traveller: newTraveller });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Failed to Add Traveller", error: error.message });
  }
}

// Delete Saved Traveller
async function deleteSavedTraveller(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    const userId = req.user._id;

    const { travellerId } = req.params || {};

    if (!travellerId) {
      return res.status(400).json({ msg: "Traveller ID is Required" });
    }

    const traveller = await Traveller.findOne({ _id: travellerId, userId });

    if (!traveller) {
      return res.status(404).json({
        msg: `Traveller Not Found for Given Traveller ID : ${travellerId}`,
      });
    }

    await Traveller.deleteOne({ _id: travellerId });

    return res.status(200).json({
      msg: "Traveller Deleted Successfully",
      deletedTraveller: traveller,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Failed to Delete Traveller", error: error.message });
  }
}

// Export Controller Functions
module.exports = {
  getSavedTravellers,
  addToSavedTraveller,
  deleteSavedTraveller,
};
