const bcrypt = require("bcrypt");
const { APIError } = require("../helpers/error");
const msgUtil = require("../helpers/utils/msgUtil");
const httpStatus = require("../helpers/httpStatus");
const db = require("../db/database");

class User {
  // method to create a new user in the database
  static async createUser(user) {
    const duplicateCheck = await db.query(
      `SELECT email 
        FROM users 
        WHERE email = $1`,
      [user.email]
    );

    if (duplicateCheck.rows[0]) {
      throw new APIError(httpStatus.BAD_REQUEST, msgUtil.userAlreadyExists);
    }

    const hashedPassword = await bcrypt.hashSync(user.pswd, 10);

    const result = await db.query(
      `INSERT INTO users 
          ( pswd, firstname, lastname, email) 
        VALUES ($1, $2, $3, $4) 
        RETURNING pswd, firstname, lastname, email , id`,
      [hashedPassword, user.firstname, user.lastname, user.email]
    );
    console.log("insert = ", result.rowCount);

    return result.rows[0];
  }

  // method to check if user with Email Exists in the database
  static async checkIfUserWithEmailExists(email) {
    const user = await db.query(
      `SELECT *
        FROM users 
        WHERE email = $1`,
      [email]
    );

    if (user.rows[0] == null) {
      throw new APIError(httpStatus.NOT_FOUND, msgUtil.userNotFound);
    }

    return user.rows[0];
  }

  // method to get specific user agaist given id
  static async getUser(_id) {
    const user = await db.query(
      `SELECT id , email , firstname  , lastname,  createdAt , updatedAt 
      FROM users 
      WHERE id = $1`,
      [_id]
    );

    if (!user.rows[0]) {
      throw new APIError(httpStatus.NOT_FOUND, msgUtil.noUserExists);
    }

    return user.rows[0];
  }

  // method to check password
  static async checkPass(user, pswd) {
    return await bcrypt.compareSync(pswd, user.pswd);
  }

  // method to delete a specific user against id
  static async deleteUser(_id) {
    const user = await db.query(`delete from users where id = $1`, [_id]);

    return user.rows[0];
  }

  static async changePassword(_id, password) {
    const user1 = await db.query(
      `SELECT *
        FROM users 
        WHERE id = $1`,
      [_id]
    );

    if (!user1.rows[0]) {
      throw new APIError(httpStatus.NOT_FOUND, msgUtil.noUserExists);
    }

    if (user.checkPass(user1.rows[0], password)) {
      throw new APIError(
        httpStatus.BAD_REQUEST,
        "This is your current password change your password first"
      );
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);
    const user = await db.query(`update users set pswd = $1 where id = $2`, [
      hashedPassword,
      _id,
    ]);
    return user.rows[0];
  }
}

module.exports = User;
