const express = require("express");
const router = express.Router();
const authRouter = require("./routers/auth.router");
const pingRouter = require("./routers/ping.router");
const cityRouter = require("./routers/city.router");

const eventRouter = require("./routers/event.router");

router.use([authRouter, pingRouter, cityRouter, eventRouter]);

module.exports = router;
