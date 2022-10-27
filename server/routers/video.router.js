const express = require("express");
const router = express.Router();
const videoController = require("../controllers/Video.controller");
const isAuth = require("../middleware/isAuth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "videoDataFiles");
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

module.exports = router;