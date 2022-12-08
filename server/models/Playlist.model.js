const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

module.exports = sequelize.define("playlist", {
  title: {
    type: DataTypes.TEXT,
    required: true,
  },
  poster: {
    type: DataTypes.TEXT,
    required: true,
  },
  time: {
    type: DataTypes.TEXT,
    required: true,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, { tableName: "playlist", });