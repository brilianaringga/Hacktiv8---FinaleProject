require("dotenv").config();
const request = require("supertest");
const { sequelize, User } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const app = require("../app");

let token;

beforeAll(async () => {
  try {
    // create user
    const user = await User.create({
      name: "Unit Test Movies",
      username: "UTMovies",
      email: "UTMovies@mail.com",
      password: hashPassword("password1"),
      role: "admin",
      address: "Jakarta",
      phoneNumber: "0811111111",
    });

    // generate token
    let payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    token = generateToken(payload);
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true });
  await sequelize.close();
});

describe("Movie test", () => {
  it("should be able to fetch movie list", async () => {
    const response = await request(app)
      .get("/movies")
      .set("Content-Type", "application/json")
      .auth(token, { type: "bearer" });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should not be able to fetch movie list because not provide token", async () => {
    const response = await request(app).get("/movies");

    expect(response.statusCode).toBe(401);
    expect(response.body.name).toBe("Unauthorized");
  });
});
