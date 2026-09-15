const express = require("express");
const router = express.Router();

const Booking = require("./booking.controller");
const debugAuth = require("../../common/middlewares/debugAuth.middleware");

router.post("/:showId", debugAuth, Booking.confirmBookibg);

module.exports = router;
