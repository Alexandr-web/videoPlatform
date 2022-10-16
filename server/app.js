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

module.exports = app;