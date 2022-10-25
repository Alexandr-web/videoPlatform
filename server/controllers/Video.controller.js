const VideoModel = require("../models/Video.model");
const User = require("../models/User.model");

class Video {
  async load(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, });
      }

      const body = req.body;
      const files = req.files || {};
      const requiredParams = ["title", "description", "video", "poster", "time"];

      if (!Object.keys({ ...body, ...files, }).every((key) => requiredParams.includes(key))) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, });
      }

      const videoData = {
        ...body,
        poster: files.poster[0].filename,
        src: files.video[0].filename,
        userId: req.userId,
      };

      await VideoModel.create(videoData);

      return res.status(200).json({ ok: true, message: "Видео загружено", status: 200, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, });
    }
  }

  async getAll(req, res) {
    try {
      const allVideos = await VideoModel.findAll();
      const promises = allVideos.map(({ userId, }) => User.findOne({ where: { id: userId, }, }));

      return Promise.all(promises)
        .then((data) => {
          const videos = data.map(({ id, name, }) => {
            const video = allVideos.find(({ userId, }) => userId === id);

            return {
              ...video,
              author: {
                name,
                id,
              },
            };
          });

          return res.status(200).json({ ok: true, status: 200, videos, });
        })
        .catch((err) => {
          console.log(err);

          return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, });
        });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, });
    }
  }
}

module.exports = new Video();