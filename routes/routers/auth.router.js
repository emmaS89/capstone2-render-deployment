const express = require("express");
const authEndpoints = require("./../../endpoints/auth.endpoints");
const authController = require("./../../controllers/auth.controller");
const router = express.Router();
const exjwt = require("express-jwt");
const { body } = require("express-validator");
const { processValidationErrors } = require("../../helpers/error");
const msgUtil = require("../../helpers/utils/msgUtil");
const { SECRET_KEY } = require("../../config/db.config");

const keys = {
  jwtsecret: SECRET_KEY,
};

const ejwtauth = exjwt({ secret: keys.jwtsecret, algorithms: ["HS256"] });

//route to register register user in the database
router.post(
  authEndpoints.register,
  body("email", msgUtil.emailValidation).isEmail(),
  body("pswd", msgUtil.passwordValidation).isLength({ min: 6 }).isString(),
  body("firstname").not().isEmpty().withMessage(msgUtil.firstNameValidation),
  body("lastname").not().isEmpty().withMessage(msgUtil.lastNameValidation),
  processValidationErrors,
  authController.register
);

// route for login
router.post(
  authEndpoints.login,
  body("email", msgUtil.emailValidation).isEmail(),
  body("pswd", msgUtil.passwordValidation).isLength({ min: 6 }).isString(),
  processValidationErrors,
  authController.login
);

router.post(
  authEndpoints.changePassword,
  ejwtauth, // check token if there no token with request it throw error of unauthorize
  processValidationErrors,
  authController.updateUserPasswordById
);

module.exports = router;
