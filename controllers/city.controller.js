const responseUtil = require("../helpers/utils/responseUtil");
const httpStatus = require("../helpers/httpStatus");
const msgUtil = require("../helpers/utils/msgUtil");
const status = require("../helpers/status");
const timeUtil = require("../helpers/utils/timeUtil");
const City = require("../models/city");

const addNewCity = async (req, res, next) => {
  let city = City;
  city
    .addNewCity(req.body)
    .then((data) => {
      responseUtil.send(
        httpStatus.SUCCESS,
        status.SUCCESS,
        msgUtil.cityAdded,
        {},
        res
      );
    })
    .catch(next);
};

const getAllCities = async (req, res, next) => {
  let city = City;
  city
    .getAllCities()
    .then((data) => {
      responseUtil.send(
        httpStatus.SUCCESS,
        status.SUCCESS,
        msgUtil.success,
        {
          cities: data,
        },
        res
      );
    })
    .catch(next);
};

const cityController = {
  addNewCity: addNewCity,
  getAllCities: getAllCities,
};

module.exports = cityController;
