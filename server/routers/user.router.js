const express = require("express");
const router = express.Router();
const userController = require("../controllers/User.controller");
const isAuth = require("../middleware/isAuth");
const serverIsTooBusy = require("../middleware/serverIsTooBusy");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, process.env.AVATARS_FILES_FOLDER);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, });
const editLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: (req, res) => {
    return res.status(429).json({
      message: "Слишком много попыток изменения данных пользователя. Повторите еще раз через 5 минут",
      status: 429,
      type: "error",
      ok: false,
    });
  },
});
const setFollowingLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 50,
  message: (req, res) => {
    return res.status(429).json({
      message: "Слишком много попыток совершить подписку на каналы. Повторите еще раз через 30 минут",
      status: 429,
      type: "error",
      ok: false,
    });
  },
});

router.get("/:id", serverIsTooBusy, userController.getOne);
router.get("/:id/videos", serverIsTooBusy, isAuth, userController.getVideos);
router.get("/:id/followers", serverIsTooBusy, isAuth, userController.getFollowers);
router.get("/:id/followings", serverIsTooBusy, isAuth, userController.getFollowings);
router.get("/:id/history", serverIsTooBusy, isAuth, userController.getHistory);
router.get("/:id/favorites", serverIsTooBusy, isAuth, userController.getFavorites);
router.get("/:id/playlists", serverIsTooBusy, isAuth, userController.getPlaylists);
router.put("/:id/edit", editLimit, serverIsTooBusy, isAuth, upload.single("avatar"), userController.edit);
router.post("/:currentUserId/following/:followingUserId", setFollowingLimit, serverIsTooBusy, isAuth, userController.setFollowing);

module.exports = router;