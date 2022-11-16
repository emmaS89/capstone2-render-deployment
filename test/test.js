const express = require("express");
const chai = require("chai");
const request = require("supertest");
const app = express();

describe("Test server is working", () => {
  it("should work.", () => {
    request(app)
      .post("api/")
      .send({})
      .expect(201)
      .then((res) => {
        // more validations can be added here as required
      });
  });
});

describe("Test sign up", () => {
  it("should create new user in database.", () => {
    request(app)
      .post("api/users/register")
      .send({
        firstname: "test",
        lastname: "last",
        email: "test21@gmail.com",
        pswd: "Admin!23",
      })
      .expect(201)
      .then((res) => {
        console.log(res);
      });
  });
});

describe("Test log in", () => {
  it("should login in user in app", () => {
    request(app)
      .post("api/users/authenticate")
      .send({
        email: "test21@gmail.com",
        pswd: "Admin!23",
      })
      .expect(201)
      .then((res) => {
        console.log(res);
      });
  });
});

describe("Test getting all cities", () => {
  it("should get all cities", () => {
    request(app)
      .get("api/city/getAll")
      .send({})
      .expect(201)
      .then((res) => {
        console.log(res);
      });
  });
});
