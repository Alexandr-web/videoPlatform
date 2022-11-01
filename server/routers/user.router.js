const express = require("express");
const router = express.Router();
const userController = require("../controllers/User.controller");
const isAuth = require("../middleware/isAuth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "avatars");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, });

router.get("/api/:id", userController.getOne);
router.get("/api/:id/videos", isAuth, userController.getVideos);
router.get("/api/:id/followers", isAuth, userController.getFollowers);
router.get("/api/:id/followings", isAuth, userController.getFollowings);
router.put("/:id/edit", isAuth, upload.single("avatar"), userController.edit);
router.post("/:currentUserId/following/:followingUserId", isAuth, userController.setFollowing);

module.exports = router;