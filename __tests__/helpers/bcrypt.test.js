require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../../helpers/bcrypt");
const { generateToken, verifyToken } = require("../../helpers/jwt");

const SECRET_KEY = process.env.JWT_SECRET;

describe("Bcrypt test", () => {
  it("Should be able to hash password", async () => {
    const password = "testpassword";
    const hashedPassword = hashPassword(password);
    const result = bcrypt.compareSync(password, hashedPassword);

    expect(result).toBe(true);
  });

  it("Should be able to compare true hashed password", async () => {
    const password = "testpassword";
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const result = comparePassword(password, hashedPassword);

    expect(result).toBe(true);
  });

  it("Should be able to compare false hashed password", async () => {
    const password = "testpassword";
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const wrongPassword = "testpasswordwrong";

    const result = comparePassword(wrongPassword, hashedPassword);

    expect(result).toBe(false);
  });
});

describe("JWT test", () => {
  it("Should be able to generate JWT Token", async () => {
    const payload = {
      username: "username",
    };
    const token = generateToken(payload);

    expect(token).toBeDefined();
  });

  it("Should be able to validate valid JWT Token", async () => {
    const payload = {
      username: "username",
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    const result = verifyToken(token);

    expect(result).toBeDefined();
    expect(result.username).toBe("username");
  });
});
