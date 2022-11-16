var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");

var apiRouter = require("./routes/api");
const { handleErrors } = require("./helpers/error");
const fs = require("fs");
const config = require("./config/loggerConfig");
const httpStatus = require("./helpers/httpStatus");
var cors = require("cors");
var app = express();

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(config.accessLogFile, {
  flags: "a",
});
// log only 4xx and 5xx responses to console
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < httpStatus.BAD_REQUEST;
    },
  })
);
app.use(cors());
app.use(morgan("common", { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/api", apiRouter);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
app.use(handleErrors);

module.exports = app;
