const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/userAuthMiddlware");

const {
  getSavedTravellers,
  addToSavedTraveller,
  deleteSavedTraveller,
} = require("../controllers/userController/travellers");

router.get("/travellers", authUser, getSavedTravellers);
router.post("/travellers", authUser, addToSavedTraveller);
router.delete("/travellers/:travellerId", authUser, deleteSavedTraveller);

module.exports = router;
