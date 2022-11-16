const responseUtil = require("../helpers/utils/responseUtil");
const httpStatus = require("../helpers/httpStatus");
const msgUtil = require("../helpers/utils/msgUtil");
const status = require("../helpers/status");
const timeUtil = require("../helpers/utils/timeUtil");
const Event = require("../models/event");

const addNewEvent = (req, res, next) => {
  let event = Event;
  event
    .addNewEvent(req.body)
    .then((data) => {
      responseUtil.send(
        httpStatus.SUCCESS,
        status.SUCCESS,
        msgUtil.eventAdded,
        {
          events: data,
        },
        res
      );
    })
    .catch(next);
};

const getAllActiveEvents = (req, res, next) => {
  let event = Event;
  event
    .getAllEvents()
    .then((data) => {
      responseUtil.send(
        httpStatus.SUCCESS,
        status.SUCCESS,
        msgUtil.success,
        {
          events: data,
        },
        res
      );
    })
    .catch(next);
};

const getFilteredEvents = (req, res, next) => {
  let event = Event;
  event
    .filterEvents({
      title: req.body.title,
      cityId: req.body.cityId,
      startDate: req.body.startDate,
    })
    .then((data) => {
      responseUtil.send(
        httpStatus.SUCCESS,
        status.SUCCESS,
        msgUtil.success,
        {
          events: data,
        },
        res
      );
    })
    .catch(next);
};

const updateEventById = (req, res, next) => {
  let event = Event;
  event
    .updateEventById({ ...req.body, id: req.params.id })
    .then((data) => {
      responseUtil.send(
        httpStatus.SUCCESS,
        status.SUCCESS,
        msgUtil.success,
        {
          event: data,
        },
        res
      );
    })
    .catch(next);
};

const getEventById = (req, res, next) => {
  let event = Event;
  event
    .getEventById(req.params.id)
    .then((data) => {
      responseUtil.send(
        httpStatus.SUCCESS,
        status.SUCCESS,
        msgUtil.success,
        {
          event: data[0],
        },
        res
      );
    })
    .catch(next);
};

const eventController = {
  addNewEvent: addNewEvent,
  getAllActiveEvents: getAllActiveEvents,
  getFilteredEvents: getFilteredEvents,
  updateEventById: updateEventById,
  getEventById: getEventById,
};

module.exports = eventController;
