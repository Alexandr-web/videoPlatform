const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

module.exports = sequelize.define("video", {
  title: {
    type: DataTypes.TEXT,
    required: true,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likes: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  dislikes: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  src: {
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
  duration: {
    type: DataTypes.FLOAT,
    required: true,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, { tableName: "video", });