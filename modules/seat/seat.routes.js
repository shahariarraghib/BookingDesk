const express = require("express");
const router = express.Router();

const Seat = require("./seat.controller");
const debugAuth = require("../../common/middlewares/debugAuth.middleware");

router.get("/seats", Seat.getAvailableSeat);
router.post("/seats/lock", debugAuth, Seat.lockSeat);

module.exports = router;
