const { APIError } = require("../helpers/error");
const msgUtil = require("../helpers/utils/msgUtil");
const httpStatus = require("../helpers/httpStatus");
const db = require("../db/database");

class City {
  // method to add new City in database cityname + country are unique
  static async addNewCity(city) {
    const duplicateCheck = await db.query(
      `SELECT name 
        FROM cities 
        WHERE name = $1 and country = $2`,
      [city.name, city.country]
    );

    if (duplicateCheck.rows[0]) {
      throw new APIError(httpStatus.BAD_REQUEST, msgUtil.cityAlreadyExists);
    }

    const result = await db.query(
      `INSERT INTO cities 
          ( name, country) 
        VALUES ($1, $2) 
        RETURNING name, country, id`,
      [city.name, city.country]
    );
    console.log("insert = ", result.rowCount);

    return result.rows[0];
  }

  // method to return all cities data present in the database
  static async getAllCities() {
    const result = await db.query(
      `SELECT * 
      FROM cities`
    );

    return result.rows;
  }

  // method to get city bt name
  static async getCityByname(name) {
    const result = await db.query(
      `SELECT * 
      FROM cities where name  = $1`,
      [name]
    );

    return result.rows[0];
  }

  // method to get city by id
  static async getCityById(id) {
    const result = await db.query(
      `SELECT * 
      FROM cities where id  = $1`,
      [id]
    );

    return result.rows[0];
  }
}

module.exports = City;
