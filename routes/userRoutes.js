const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/userAuthMiddlware");

const {
  getUserProfile,
  updateProfile,
} = require("../controllers/userController/profile");

const {
  getSavedTravellers,
  addToSavedTraveller,
  deleteSavedTraveller,
} = require("../controllers/userController/travellers");

router.get("/profile", authUser, getUserProfile);
router.put("/update", authUser, updateProfile);

router.get("/travellers", authUser, getSavedTravellers);
router.post("/travellers", authUser, addToSavedTraveller);
router.delete("/travellers/:travellerId", authUser, deleteSavedTraveller);

module.exports = router;
