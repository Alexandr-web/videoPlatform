const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth.controller");
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

router.post("/registration", upload.single("avatar"), authController.registration);
router.post("/login", authController.login);

module.exports = router;