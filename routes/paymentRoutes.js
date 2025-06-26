const express = require("express");
const router = express.Router();

const initiatePayment = require("../controllers/paymentController/initiatePayment");

router.post("/initiate", initiatePayment);

module.exports = router;
