const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = (req, res, next) => {
  try {
    const token = req.get("token");
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
    return res.status(401).json(err);
  }
};

module.exports = authentication;
