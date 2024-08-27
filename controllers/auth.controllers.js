const { where } = require("sequelize");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { Users } = require("../models");
const { generateToken } = require("../helpers/jwt");

const register = async (req, res, next) => {
  const { name, username, email, password, role, address, phoneNumber } =
    req.body;

  try {
    const user = await Users.create({
      name,
      username,
      email,
      password: hashPassword(password),
      role,
      address,
      phoneNumber,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({
      where: { email },
    });

    //   check if user exist
    if (!user) {
      throw {
        name: "User Login Error",
        devMessage: `User with email ${email} not found`,
      };
    }

    //   check is password correct
    const isPasswordCorrect = comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw {
        name: "User Login Error",
        devMessage: `User password with email ${email} does not match`,
      };
    }

    let payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = generateToken(payload);

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(401).json(error);
  }
};

module.exports = {
  register,
  login,
};
