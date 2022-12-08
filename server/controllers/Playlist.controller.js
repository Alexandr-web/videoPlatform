const PlaylistModel = require("../models/Playlist.model");
const Video = require("../models/Video.model");
const User = require("../models/User.model");

class Playlist {
  // Gets a playlist by its id from the database
  async getOne(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const playlist = await PlaylistModel.findOne({ where: { id, }, });

      return res.status(200).json({ ok: true, playlist, status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Getting a video playlist by its id
  async getVideos(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const videos = await Video.findAll({ where: { playlistId: id, }, });
      const promises = videos.map((video) => {
        return User.findOne({ where: { id: video.userId, }, })
          .then(({ id: authorId, nickname, }) => ({
            ...video.dataValues,
            author: { id: authorId, nickname, },
          })).catch((err) => {
            console.log(err);

            return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
          });
      });

      return Promise.all(promises)
        .then((arrVideos) => ({ status: 200, videos: arrVideos, type: "success", }))
        .catch((err) => {
          console.log(err);

          return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
        });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  async add(req, res) {
    try {
      // ...
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }
}

module.exports = new Playlist();