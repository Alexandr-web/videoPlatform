const express = require("express");
const router = express.Router();
const videoController = require("../controllers/Video.controller");
const isAuth = require("../middleware/isAuth");
const serverIsTooBusy = require("../middleware/serverIsTooBusy");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, process.env.VIDEO_DATA_FILES_FOLDER);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, });
const removeLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: "Слишком много попыток удаления видео. Попробуйте еще раз через 30 минут",
});
const editLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: "Слишком много попыток изменения данных видео. Попробуйте еще раз через 30 минут",
});

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
router.get("/", serverIsTooBusy, videoController.getAll);
router.get("/:id", serverIsTooBusy, isAuth, videoController.getOne);
router.put("/:id/view", serverIsTooBusy, isAuth, videoController.setView);
router.put("/:id/rate", serverIsTooBusy, isAuth, videoController.setRate);
router.delete("/:id/delete", removeLimit, serverIsTooBusy, isAuth, videoController.remove);
router.put("/:id/edit", editLimit, serverIsTooBusy, isAuth, upload.fields([
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