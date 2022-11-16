const express = require("express");
const exjwt = require("express-jwt");
const { body, param } = require("express-validator");
const eventController = require("../../controllers/event.controller");
const eventEndpoints = require("../../endpoints/event.endpoints");
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
  eventEndpoints.createEvent,
  body("title").not().isEmpty().withMessage(msgUtil.eventsValidations),
  body("description").not().isEmpty().withMessage(msgUtil.eventsValidations),
  body("startDate").not().isEmpty().withMessage(msgUtil.eventsValidations),
  body("endDate").not().isEmpty().withMessage(msgUtil.eventsValidations),
  body("contactno").not().isEmpty().withMessage(msgUtil.eventsValidations),
  body("latitude").not().isEmpty().withMessage(msgUtil.eventsValidations),
  body("longitude").not().isEmpty().withMessage(msgUtil.eventsValidations),
  body("city").not().isEmpty().withMessage(msgUtil.eventsValidations),
  ejwtauth, // check token if there no token with request it throw error of unauthorize
  processValidationErrors,
  eventController.addNewEvent
);

router.get(
  eventEndpoints.getAllEvents,
  ejwtauth,
  processValidationErrors,
  eventController.getAllActiveEvents
);

router.post(
  eventEndpoints.filterEvent,
  ejwtauth,
  processValidationErrors,
  eventController.getFilteredEvents
);

router.put(
  eventEndpoints.updateEvent,
  ejwtauth,
  processValidationErrors,
  eventController.updateEventById
);

router.get(
  eventEndpoints.getEventById,
  ejwtauth,
  processValidationErrors,
  eventController.getEventById
);

module.exports = router;
