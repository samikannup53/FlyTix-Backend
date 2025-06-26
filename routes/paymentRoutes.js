const express = require("express");
const router = express.Router();

const initiatePayment = require("../controllers/paymentController/initiatePayment");
const verifyPayment = require("../controllers/paymentController/verifyPayment");

router.post("/initiate", initiatePayment);
router.get("/verify", verifyPayment);

module.exports = router;
