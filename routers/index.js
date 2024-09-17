const router = require("express").Router();

const { register, login } = require("../controllers/auth.controllers");
const authentication = require("../middlewares/authentication");
const movie = require("./movies");
const bookmark = require("./bookmarks");

router.post("/register", register);
router.post("/login", login);

router.use(authentication);
router.use(movie);
router.use(bookmark);

module.exports = router;
