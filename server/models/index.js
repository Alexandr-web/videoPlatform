const User = require("./User.model");
const Video = require("./Video.model");
const Playlist = require("./Playlist.model");

User.hasMany(Video);
Playlist.hasMany(Video);
Playlist.belongsTo(User);

module.exports = {
  User,
  Video,
  Playlist,
};