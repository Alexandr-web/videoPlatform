const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const playlistController = require("../controllers/Playlist.controller");
const multer = require("multer");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, process.env.PLAYLIST_POSTERS_FOLDER);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, });

router.get("/:id", isAuth, playlistController.getOne);
router.get("/:id/videos", isAuth, playlistController.getVideos);
router.delete("/:id/remove", isAuth, playlistController.remove);
router.post("/add", isAuth, upload.single("poster"), playlistController.add);

module.exports = router;