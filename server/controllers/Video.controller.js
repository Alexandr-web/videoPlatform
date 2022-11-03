const VideoModel = require("../models/Video.model");
const User = require("../models/User.model");

class Video {
  async load(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const body = req.body;
      const files = req.files || {};
      const requiredParams = ["title", "description", "video", "poster", "time", "duration"];

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

  async getAll(req, res) {
    try {
      const allVideos = await VideoModel.findAll();
      const promises = allVideos.map(({ userId, }) => User.findOne({ where: { id: userId, }, }));

      return Promise.all(promises)
        .then((data) => {
          const videos = data.map(({ id, nickname, }) => {
            const video = allVideos.find(({ userId, }) => userId === id);

            return {
              ...video.dataValues,
              author: {
                nickname,
                id,
              },
            };
          });

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

      return res.status(200).json({ ok: true, video, status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }
}

module.exports = new Video();