const responseUtil = require("../helpers/utils/responseUtil");
const httpStatus = require("../helpers/httpStatus");
const msgUtil = require("../helpers/utils/msgUtil");
const status = require("../helpers/status");
const timeUtil = require("../helpers/utils/timeUtil");

const pingServer = (req, res, next) => {
  responseUtil.send(
    httpStatus.SUCCESS,
    status.SUCCESS,
    msgUtil.success,
    {
      serverTime: timeUtil.getServerTime(),
    },
    res
  );
};

const ping = {
  ping: pingServer,
};

module.exports = ping;
