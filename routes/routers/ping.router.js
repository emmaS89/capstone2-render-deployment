const express = require("express");
const pingController = require("../../controllers/ping.controller");
const pingEndpoints = require("../../endpoints/ping.endpoints");

const router = express.Router();

router.get(pingEndpoints.ping, pingController.ping);

module.exports = router;
