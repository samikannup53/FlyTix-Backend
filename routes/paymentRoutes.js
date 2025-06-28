const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/userAuthMiddlware");

const initiatePayment = require("../controllers/paymentController/initiatePayment");
const verifyPayment = require("../controllers/paymentController/verifyPayment");

router.post("/initiate", authUser, initiatePayment);
router.post("/verify", authUser, verifyPayment);

module.exports = router;
