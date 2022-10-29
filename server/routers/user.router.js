const express = require("express");
const router = express.Router();
const userController = require("../controllers/User.controller");
const isAuth = require("../middleware/isAuth");

router.get("/api/:id", userController.getOne);
router.get("/api/:id/videos", isAuth, userController.getVideos);

module.exports = router;