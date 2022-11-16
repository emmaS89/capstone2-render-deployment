const express = require("express");
const exjwt = require("express-jwt");
const { body } = require("express-validator");
const cityController = require("../../controllers/city.controller");
const cityEndpoints = require("../../endpoints/city.endpoints");
const { processValidationErrors } = require("../../helpers/error");
const msgUtil = require("../../helpers/utils/msgUtil");
const { SECRET_KEY } = require("../../config/db.config");
const keys = {
  jwtsecret: SECRET_KEY,
};

const ejwtauth = exjwt({ secret: keys.jwtsecret, algorithms: ["HS256"] });

const router = express.Router();

// authorize route must required jwt token
router.post(
  cityEndpoints.addNewCity,
  body("name").not().isEmpty().withMessage(msgUtil.cityNameRequired),
  body("country").not().isEmpty().withMessage(msgUtil.countryNameValidation),
  ejwtauth, // check token if there no token with request it throw error of unauthorize
  processValidationErrors,
  cityController.addNewCity
);

router.get(
  cityEndpoints.getAllCitites,
  ejwtauth,
  processValidationErrors,
  cityController.getAllCities
);

module.exports = router;
