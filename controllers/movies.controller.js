const { Movie } = require("../models");

exports.getAllMovies = async (req, res, next) => {
  try {
    const movies = await Movie.findAll();

    res.json(movies);
  } catch (error) {
    next(error);
  }
};
