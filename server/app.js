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
const userRouter = require("./routers/user.router");

app.use("/auth", authRouter);
app.use("/user", userRouter);

module.exports = app;