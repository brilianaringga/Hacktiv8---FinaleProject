require("dotenv").config();
const request = require("supertest");
const { sequelize, User, Bookmark, Movie } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const app = require("../app");

let token;
let userTest;

beforeAll(async () => {
  try {
    // create user
    userTest = await User.create({
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
      id: userTest.id,
      username: userTest.username,
      email: userTest.email,
    };

    token = generateToken(payload);
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true });
  await Bookmark.destroy({ truncate: true, cascade: true });
  await sequelize.close();
});

describe("Bookmarks test", () => {
  it("should be able to fetch bookmarks list", async () => {
    const movieId = 1;

    // add bookmark
    await Bookmark.create({
      userId: userTest.id,
      movieId: movieId,
    });

    const response = await request(app)
      .get("/bookmark")
      .set("Content-Type", "application/json")
      .auth(token, { type: "bearer" });

    expect(response.statusCode).toBe(200);
    expect(response.body[0].movieId).toBe(movieId);
  });

  it("should not be able to fetch bookmarks", async () => {
    const response = await request(app)
      .get("/bookmark")
      .set("Content-Type", "application/json");

    expect(response.statusCode).toBe(401);
  });

  it("should be able to bookmarks movie", async () => {
    const movieId = 2;

    const response = await request(app)
      .post(`/bookmark/${movieId}`)
      .set("Content-Type", "application/json")
      .auth(token, { type: "bearer" });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Succes adding new bookmark");
    expect(response.body.userId).toBe(userTest.id);
    expect(response.body.movieId).toBe(movieId);
  });
});
