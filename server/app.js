const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const host = require("./host");

require("dotenv").config();
require("./models/index");
require("./connectToDatabase")();

app.use(cors({ origin: [host], }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));

const authRouter = require("./routers/auth.router");
const videoRouter = require("./routers/video.router");
const userRouter = require("./routers/user.router");
const playlistRouter = require("./routers/playlist.router");

app.use("/api/auth", authRouter);
app.use("/api/video", videoRouter);
app.use("/api/user", userRouter);
app.use("/api/playlist", playlistRouter);

module.exports = app;