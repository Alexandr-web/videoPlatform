const User = require("./User.model");
const Video = require("./Video.model");

User.hasMany(Video);

module.exports = {
  User,
  Video,
};