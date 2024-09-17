const router = require("express").Router();
const { getAllMovies } = require("../controllers/movies.controller");

router.get("/movies", getAllMovies);

module.exports = router;
