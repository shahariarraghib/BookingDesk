const express = require("express");
const router = express.Router();

const Show = require("./show.controller");
const debugAuth = require("../../common/middlewares/debugAuth.middleware");

router.get("/shows", Show.getShow);

router.post("/shows", debugAuth, Show.createShow);

module.exports = router;
