const router = require("express").Router();
const {
  addMyBookmark,
  getMyBookmark,
} = require("../controllers/bookmarks.controller");

router.post("/bookmark/:movieId", addMyBookmark);
router.get("/bookmark", getMyBookmark);

module.exports = router;
