const logger = require("../helpers/logger");
const process = require("process");
const msgUtil = require("../helpers/utils/msgUtil");
const { Client } = require("pg");
const { DB_URI } = require("../config/db.config");

class Database {
  Postgress_URI = DB_URI;

  constructor() {
    if (this.Postgress_URI) {
      console.log("connected with db url = ", this.Postgress_URI);
      this._connect();
    } else {
      throw new Error(msgUtil.postgressUriNotConfigured);
    }
  }

  _connect() {
    try {
      const client = new Client({
        connectionString: DB_URI,
        // ssl: { rejectUnauthorized: false },
      });
      logger.info(msgUtil.databaseConnectionSuccessfull);
      logger.info(msgUtil.dbInfo("event_management"));
      client.connect();
      return client;
    } catch (err) {
      logger.info(msgUtil.databaseConnectionError);
      return null;
    }
  }
}

const db = new Database();
module.exports = db._connect();
