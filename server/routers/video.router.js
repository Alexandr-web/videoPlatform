const express = require("express");
const router = express.Router();
const videoController = require("../controllers/Video.controller");
const isAuth = require("../middleware/isAuth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, process.env.VIDEO_DATA_FILES_FOLDER);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, });

router.post("/load", isAuth, upload.fields([
  {
    name: "video",
    maxCount: 1,
  },
  {
    name: "poster",
    maxCount: 1,
  }
]), videoController.load);
router.get("/api", videoController.getAll);
router.get("/api/:id", isAuth, videoController.getOne);
router.put("/:id/view", isAuth, videoController.setView);
router.put("/:id/rate", isAuth, videoController.setRate);
router.put("/:id/edit", isAuth, upload.fields([
  {
    name: "video",
    maxCount: 1,
  },
  {
    name: "poster",
    maxCount: 1,
  }
]), videoController.edit);

module.exports = router;