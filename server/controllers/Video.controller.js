const VideoModel = require("../models/Video.model");
const User = require("../models/User.model");

class Video {
  // Upload video file
  async load(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const body = req.body;
      const files = req.files || {};
      const requiredParams = ["title", "description", "video", "poster", "time", "duration"];

      // When requesting, there must be required data
      if (!Object.keys({ ...body, ...files, }).every((key) => requiredParams.includes(key))) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const videoData = {
        ...body,
        poster: files.poster[0].filename,
        src: files.video[0].filename,
        userId: req.userId,
      };

      await VideoModel.create(videoData);

      return res.status(200).json({ ok: true, message: "Видео загружено", status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Get all videos
  async getAll(req, res) {
    try {
      const allVideos = await VideoModel.findAll();

      // Getting video data (author, title, description, ...)
      const promises = allVideos.map((video) => {
        return User.findOne({ where: { id: video.userId, }, })
          .then(({ id, nickname, }) => {
            return {
              ...video.dataValues,
              author: {
                id,
                nickname,
              },
            };
          });
      });

      return Promise.all(promises)
        .then((videos) => {
          return res.status(200).json({ ok: true, status: 200, videos, type: "success", });
        })
        .catch((err) => {
          console.log(err);

          return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
        });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Get video by id
  async getOne(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", type: "error", status: 403, });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const video = await VideoModel.findOne({ where: { id, }, });
      const author = await User.findOne({ where: { id: video.userId, }, });
      const authorData = Object
        .keys(author.dataValues)
        .filter((key) => ["id", "nickname", "avatar", "followersId"].includes(key))
        .reduce((acc, key) => {
          acc[key] = author.dataValues[key];

          return acc;
        }, {});

      const videoData = {
        ...video.dataValues,
        author: authorData,
      };

      return res.status(200).json({ ok: true, video: videoData, status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Setting the view for video
  async setView(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", type: "error", status: 403, });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const video = await VideoModel.findOne({ where: { id, }, });

      if (!video) {
        return res.status(404).json({ ok: false, message: "Такого видео не существует", status: 404, type: "error", });
      }

      await video.update({ views: video.views + 1, });

      return res.status(200).json({ ok: true, status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }
}

module.exports = new Video();