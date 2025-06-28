const express = require("express");
const router = express.Router();

const {
  getSavedTravellers,
  addToSavedTraveller,
  deleteSavedTraveller,
} = require("../controllers/userController/travellers");

router.get("/travellers", getSavedTravellers);
router.post("/travellers", addToSavedTraveller);
router.delete("traveller/:traverllerId", deleteSavedTraveller);

module.exports = router;
