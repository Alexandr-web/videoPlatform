const PlaylistModel = require("../models/Playlist.model");
const Video = require("../models/Video.model");
const User = require("../models/User.model");
const removeFile = require("../helpers/removeFile");

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

      const playlist = await PlaylistModel.findOne({ where: { id, }, });

      if (!playlist) {
        return res.status(404).json({ ok: false, message: "Такого плейлиста не существует", status: 404, type: "error", });
      }

      // We get videos and their authors
      const promisesVideos = playlist.videosId.map((videoId) => {
        return Video.findOne({ where: { id: videoId, }, })
          .then((video) => {
            return Promise.all([User.findOne({ where: { id: video.userId, }, }), video]);
          }).then(([{ id: authorId, nickname, }, video]) => ({
            ...video.dataValues,
            author: {
              id: authorId,
              nickname,
            },
          })).catch((err) => {
            console.log(err);

            return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
          });
      });

      return Promise.all(promisesVideos)
        .then((arrVideos) => {
          return res.status(200).json({ ok: true, status: 200, videos: arrVideos, type: "success", });
        }).catch((err) => {
          console.log(err);

          return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
        });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Adding a playlist to the database
  async add(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const body = req.body;
      const file = req.file;
      const requiredData = ["title", "time", "videos", "duration"];

      if (!Object.keys(body).every((key) => requiredData.includes(key)) || !file) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      await PlaylistModel.create({
        ...body,
        videosId: JSON.parse(body.videos),
        poster: file.filename,
        userId: req.userId,
      });

      return res.status(200).json({ ok: true, message: "Плейлист создан", status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Removes a playlist from the database
  async remove(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const playlist = await PlaylistModel.findOne({ where: { id, }, });

      if (!playlist) {
        return res.status(404).json({ ok: false, message: "Такого плейлиста не существует", status: 404, type: "error", });
      }

      if (playlist.userId !== req.userId) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для удаления этого плейлиста", status: 403, type: "error", });
      }

      // Remove poster file at playlist
      await removeFile([__dirname, "../../", "playlistPosters", playlist.poster], res);
      // Delete playlist from database
      await playlist.destroy();

      return res.status(200).json({ ok: true, message: "Плейлист удален", status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }
}

module.exports = new Playlist();