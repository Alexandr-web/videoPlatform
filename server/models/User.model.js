const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

module.exports = sequelize.define("user", {
  nickname: {
    type: DataTypes.TEXT,
    required: true,
    unique: true,
  },
  email: {
    type: DataTypes.TEXT,
    required: true,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
    required: true,
  },
  avatar: {
    type: DataTypes.TEXT,
    required: true,
  },
  followersId: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  history: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, { tableName: "user", });