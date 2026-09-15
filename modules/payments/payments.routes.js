const express = require("express");
const router = express.Router();

const Payments = require("./payments.controller");
const idempotencyCheck = require("../../common/middlewares/idempotency.middleware");
const debugAuth = require("../../common/middlewares/debugAuth.middleware");

router.post("/create-order/:bookingId", debugAuth, Payments.createOrder);
router.post(
  "/verify-payment/:bookingId",
  idempotencyCheck,
  Payments.verifyOrder,
);

module.exports = router;
