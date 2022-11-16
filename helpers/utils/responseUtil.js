const send = (httpStatus, status, statusMsg, data, res) => {
  return res.status(httpStatus).send({
    statusCode: status,
    msg: statusMsg,
    data: data,
  });
};

const responseUtil = {
  send: send,
};

module.exports = responseUtil;
