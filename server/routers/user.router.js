const express = require("express");
const router = express.Router();
const userController = require("../controllers/User.controller");

router.get("/:id", userController.getOne);

module.exports = router;