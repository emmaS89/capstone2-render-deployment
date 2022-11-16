require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "development-secret-key";
const DB_URI =
  process.env.DB_URL ||
  "postgres://postgres:root@localhost:5433/event_management";

module.exports = {
  SECRET_KEY,
  DB_URI,
};
