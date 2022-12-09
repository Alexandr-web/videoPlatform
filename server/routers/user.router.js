const express = require("express");
const router = express.Router();
const userController = require("../controllers/User.controller");
const isAuth = require("../middleware/isAuth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, process.env.AVATARS_FILES_FOLDER);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, });

router.get("/:id", userController.getOne);
router.get("/:id/videos", isAuth, userController.getVideos);
router.get("/:id/followers", isAuth, userController.getFollowers);
router.get("/:id/followings", isAuth, userController.getFollowings);
router.get("/:id/history", isAuth, userController.getHistory);
router.get("/:id/favorites", isAuth, userController.getFavorites);
router.get("/:id/playlists", isAuth, userController.getPlaylists);
router.put("/:id/edit", isAuth, upload.single("avatar"), userController.edit);
router.post("/:currentUserId/following/:followingUserId", isAuth, userController.setFollowing);

module.exports = router;