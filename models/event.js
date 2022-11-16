const { APIError } = require("../helpers/error");
const msgUtil = require("../helpers/utils/msgUtil");
const httpStatus = require("../helpers/httpStatus");
const timeUtil = require("../helpers/utils/timeUtil");
const moment = require("moment");
const City = require("../models/city");
const db = require("../db/database");

class Event {
  // method to add new Event in database
  static async addNewEvent(event) {
    const duplicateCheck = await db.query(
      `SELECT * 
        FROM events 
        WHERE title = $1`,
      [event.title]
    );

    // check if event with same title exists or not
    if (duplicateCheck.rows[0]) {
      throw new APIError(httpStatus.BAD_REQUEST, msgUtil.eventExists);
    }

    // check if city exists if exists assign its value else create new city
    // and assign its value

    let city = City;
    let updatedEvent = { ...event };
    if (event.city && event.city != "") {
      await city.getCityByname(event.city).then(async (data) => {
        if (!data) {
          await city.addNewCity({ name: event.city }).then((data) => {
            if (data && data.id) {
              updatedEvent.city = data.id;
            }
          });
        } else {
          updatedEvent.city = data.id;
        }
      });
    }

    let data = {
      ...updatedEvent,
      startDate: moment.unix(event.startDate),
      endDate: moment.unix(event.endDate),
    };

    console.log(data);
    const result = await db.query(
      `INSERT INTO events 
          (title,startDate , endDate , description , organizername , contactno,address,latitude,longitude , city , userid) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) 
        RETURNING id,title,startDate , endDate , description , organizername , contactno,address,latitude,longitude , city,userid`,
      [
        data.title,
        data.startDate,
        data.endDate,
        data.description,
        data.organizername,
        data.contactno,
        data.address,
        data.latitude,
        data.longitude,
        data.city,
        parseInt(data.userId),
      ]
    );
    console.log("insert = ", result.rowCount);

    const events = await db.query(
      `select * from events as e where e.endDate >= $1`,
      [moment.utc(new Date())]
    );

    return await this.getEventObjects(events.rows);
  }

  // method to get all active events from the database
  static async getAllEvents() {
    const events = await db.query(
      `select * from events as e where e.endDate >= $1`,
      [moment.utc(new Date())]
    );
    return await this.getEventObjects(events.rows);
  }

  static async getEventObjects(events) {
    let data = [];

    for (let event of events) {
      const city = await City.getCityById(event.city);

      let d = {
        ...event,
        city: {
          ...city,
        },
      };

      data.push(d);
    }

    return data;
  }

  // method to filter all active events from the database
  static async filterEvents(event) {
    let query = "select * from events as e where e.endDate >= $1 ";
    let options = {
      endDate: moment.utc(new Date()),
    };

    let count = 2;
    let d = [moment.utc(new Date())];

    if (event.title && event.title != "") {
      query += " and e.title = $" + count;
      count++;
      d.push(event.title);
    }

    if (event.cityId && event.cityId != "") {
      query += " and e.city = $" + count;
      count++;
      d.push(event.cityId);
    }

    if (event.startDate && event.startDate != "") {
      query += " and e.startDate >= $" + count;
      count++;
      d.push(moment.unix(event.startDate));
      query += " and e.startDate <= $" + count;
      count++;
      d.push(moment.unix(event.startDate).add(1, "day"));
    }

    const events = await db.query(query, d);
    return await this.getEventObjects(events.rows);
  }

  // method to update Event By Id
  static async updateEventById(event) {
    const duplicateCheck = await db.query(
      `SELECT * 
        FROM events 
        WHERE title = $1`,
      [event.title]
    );

    // check if event with same title exists or not
    if (duplicateCheck.rows[0] === null) {
      throw new APIError(httpStatus.NOT_FOUND, msgUtil.eventNotFound);
    }

    let city = City;
    let updatedEvent = { ...event };
    if (event.city && event.city != "") {
      await city.getCityByname(event.city).then(async (data) => {
        if (!data) {
          await city.addNewCity({ name: event.city }).then((data) => {
            if (data && data.id) {
              updatedEvent.city = data.id;
            }
          });
        } else {
          updatedEvent.city = data.id;
        }
      });
    }

    let data = {
      ...updatedEvent,
      startDate: moment.unix(event.startDate),
      endDate: moment.unix(event.endDate),
    };

    const events = await db.query(
      `update events set title = $1 ,startDate = $2 , endDate = $3, description = $4 , organizerName = $5 , contactNo = $6,address = $7,latitude = $8,longitude = $9, city = $10 where id = $11`,
      [
        data.title,
        data.startDate,
        data.endDate,
        data.description,
        data.organizername,
        data.contactno,
        data.address,
        data.latitude,
        data.longitude,
        data.city,
        data.id,
      ]
    );

    return await this.getEventById(event.id);
  }

  // method to get Event by id
  static async getEventById(id) {
    const events = await db.query(`select * from events where id = $1`, [id]);

    if (events.rows[0] === null) {
      throw new APIError(httpStatus.NOT_FOUND, msgUtil.eventNotFound);
    }

    return await this.getEventObjects(events.rows);
  }
}

module.exports = Event;
