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
  videosId: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  time: {
    type: DataTypes.TEXT,
    required: true,
  },
  duration: {
    type: DataTypes.FLOAT,
    required: true,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, { tableName: "playlist", });