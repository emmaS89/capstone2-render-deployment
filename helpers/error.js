const httpStatus = require("./httpStatus");
const logger = require("./logger");
const status = require("./status");
const msgUtil = require("./utils/msgUtil");
const responseUtil = require("./utils/responseUtil");

class APIError extends Error {
  constructor(code, msg) {
    super();
    this.statusCode = code;
    if (Array.isArray(msg)) {
      this.messages = msg;
    } else {
      this.messages = new Array({ msg });
    }
  }
}

const handleErrors = (err, req, res, next) => {
  // log it
  logger.error(err.stack);
  if (err instanceof APIError) {
    // send it
    let { statusCode, messages } = err;

    responseUtil.send(statusCode, status.ERROR, messages, {}, res);
  } else {
    // JWT errors
    let statusCode = httpStatus.SERVER_ERROR;
    let message = msgUtil.serverErrorMsg;

    if (err.name == "UnauthorizedError") {
      statusCode = httpStatus.UNAUTHORIZED;
      message = msgUtil.invalidJwtToken;
    }

    // send 500 everytime otherwise
    responseUtil.send(statusCode, status.ERROR, message, {}, res);
  }

  next();
};

function processValidationErrors(req, res, next) {
  const validationResult = require("express-validator").validationResult;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new APIError(httpStatus.BAD_REQUEST, errors.array());
  next();
}

module.exports = {
  APIError,
  handleErrors,
  processValidationErrors,
};
