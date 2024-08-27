const { where } = require("sequelize");
const { Bookmark, Movie } = require("../models");

exports.addMyBookmark = async (req, res, next) => {
  const userId = res.user.id;
  const { movieId } = req.params;

  try {
    const bookmark = await Bookmark.create({
      userId,
      movieId,
    });

    const movie = await Movie.findOne({
      where: {
        id: movieId,
      },
    });

    const payload = {
      message: "Succes adding new bookmark",
      id: bookmark.id,
      userId: userId,
      movieId: movie.id,
      movieTitle: movie.title,
    };

    res.status(201).json(payload);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getMyBookmark = async (req, res, next) => {
  const user = res.user;
  try {
    const bookmark = await Bookmark.findAll({
      where: { userId: user.id },
      include: {
        model: Movie,
      },
    });

    res.status(200).json(bookmark);
  } catch (error) {
    next(error);
  }
};
