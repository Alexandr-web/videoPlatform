const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth.controller");
const multer = require("multer");
const serverIsTooBusy = require("../middleware/serverIsTooBusy");
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

// Limit for registration
const limiterRegistration = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: (req, res) => {
    return res.status(429).json({
      message: "Слишком много попыток регистрации. Повторите еще раз через 1 час",
      status: 429,
      type: "error",
      ok: false,
    });
  },
});

// Limit for login
const limiterLogin = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 15,
  message: (req, res) => {
    return res.status(429).json({
      message: "Слишком много попыток входа. Повторите еще раз через 30 минут",
      status: 429,
      type: "error",
      ok: false,
    });
  },
});

router.post("/registration", limiterRegistration, serverIsTooBusy, upload.single("avatar"), authController.registration);
router.post("/login", limiterLogin, serverIsTooBusy, authController.login);

module.exports = router;