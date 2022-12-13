const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const serverIsTooBusy = require("../middleware/serverIsTooBusy");
const playlistController = require("../controllers/Playlist.controller");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, process.env.PLAYLIST_POSTERS_FOLDER);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, });
const removeLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: (req, res) => {
    return res.status(429).json({
      message: "Слишком много попыток удаления плейлистов. Повторите еще раз через 30 минут",
      status: 429,
      type: "error",
      ok: false,
    });
  },
});

router.get("/:id", serverIsTooBusy, isAuth, playlistController.getOne);
router.get("/:id/videos", serverIsTooBusy, isAuth, playlistController.getVideos);
router.delete("/:id/remove", removeLimit, serverIsTooBusy, isAuth, playlistController.remove);
router.post("/add", serverIsTooBusy, isAuth, upload.single("poster"), playlistController.add);

module.exports = router;