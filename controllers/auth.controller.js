const exjwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const process = require("process");
const status = require("../helpers/status");
const User = require("../models/user");
const { SECRET_KEY } = require("./../config/db.config");
const keys = {
  jwtsecret: SECRET_KEY,
};

const bcrypt = require("bcrypt");
// to make authorize route
const ejwtauth = exjwt({ secret: keys.jwtsecret, algorithms: ["HS256"] });

const { APIError } = require("../helpers/error");
const responseUtil = require("../helpers/utils/responseUtil");
const httpStatus = require("../helpers/httpStatus");
const msgUtil = require("../helpers/utils/msgUtil");

const register = async (req, res, next) => {
  let user = User;
  await user
    .createUser(req.body)
    .then((data) => {
      responseUtil.send(
        httpStatus.SUCCESS,
        status.SUCCESS,
        msgUtil.userRegisterSuccessfully,
        {},
        res
      );
    })
    .catch(next);
};

const login = async (req, res, next) => {
  let user = User;
  user
    .checkIfUserWithEmailExists(req.body.email)
    .then(async (_user) => {
      // verify password
      if (await bcrypt.compareSync(req.body.pswd, _user.pswd)) {
        let token = jwt.sign(
          {
            id: _user.id, // add user id in token to use for authorization
          },
          keys.jwtsecret
        );
        // TODO: never expiring tokens
        responseUtil.send(
          httpStatus.SUCCESS,
          status.SUCCESS,
          msgUtil.loginSuccess,
          {
            userId: _user.id,
            token: token,
            firstname: _user.firstname,
            lastname: _user.lastname,
          },
          res
        );
      } else {
        next(
          new APIError(httpStatus.BAD_REQUEST, msgUtil.invalidEmailOrPassword)
        );
      }
    })
    .catch(next);
};

const updateUserPasswordById = (req, res, next) => {
  let user = User;
  user
    .changePassword(req.body.userId, req.body.newPassword)
    .then((data) => {
      responseUtil.send(
        httpStatus.SUCCESS,
        status.SUCCESS,
        msgUtil.success,
        {
          user: "Success",
        },
        res
      );
    })
    .catch(next);
};
const auth = {
  register: register,
  login: login,
  updateUserPasswordById,
  updateUserPasswordById,
};

module.exports = auth;
