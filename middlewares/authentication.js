const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    // const token = req.get("token");

    if (!authorization) {
      throw new Error("Authorization Error");
    }

    const [type, token] = authorization.split(" ");

    if (!token) {
      throw new Error("Token Not Found");
    }

    const userDecoded = verifyToken(token);

    User.findOne({
      where: {
        id: userDecoded.id,
        email: userDecoded.email,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            name: "Authentication Error",
            devMessage: `User with id ${userDecoded.id} not found`,
          });
        }
        // req.user = user;
        res.user = user;
        return next();
      })
      .catch((err) => {
        return res.status(401).json(err);
      });
  } catch (err) {
    return res.status(401).json({
      name: "Unauthorized",
      devMessage: err.message,
    });
  }
};

module.exports = authentication;
