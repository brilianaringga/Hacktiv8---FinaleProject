const request = require("supertest");
const { sequelize, User } = require("../models");
const app = require("../app");

beforeAll(() => {});

afterAll(() => {
  User.destroy({ truncate: true, cascade: true })
    .then(() => {
      sequelize.close();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("Authentication test", () => {
  it("Should be able to register", async () => {
    const response = await request(app)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({
        name: "Unit Testing",
        username: "Unit Test",
        email: "unit@test.mail",
        password: "TestingPassword",
        role: "Admin",
        address: "Jakarta",
        phoneNumber: "0811110000",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe("unit@test.mail");
  });

  it("Should be able to login", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ email: "unit@test.mail", password: "TestingPassword" });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("Should not be able to login", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ email: "unit@test.mail", password: "WrongPassword" });

    expect(response.statusCode).toBe(401);
    expect(response.body.name).toBe("User Login Error");
    expect(response.body.devMessage).toBe(
      "User password with email unit@test.mail does not match"
    );
  });
});
