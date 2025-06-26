const express = require("express");
const router = express.Router();

const initiatePayment = require("../controllers/paymentController/initiatePayment");

router.get("/initiate", initiatePayment);

module.exports = router;
