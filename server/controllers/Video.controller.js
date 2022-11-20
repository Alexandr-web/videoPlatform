const VideoModel = require("../models/Video.model");
const User = require("../models/User.model");
const setLike = require("../helpers/setLike");
const setDislike = require("../helpers/setDislike");
const removeFile = require("../helpers/removeFile");

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
      const allVideos = await VideoModel.findAll({ order: [["createdAt", "DESC"]], });

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
        }).catch((err) => {
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

      const user = await User.findOne({ where: { id: req.userId, }, });
      const copyUserHistory = [...user.history];

      if (copyUserHistory.includes(video.id)) {
        // Move to 1 place
        const indexVideoId = copyUserHistory.indexOf(video.id);

        copyUserHistory.splice(indexVideoId, 1);
        copyUserHistory.unshift(video.id);
      } else {
        copyUserHistory.unshift(video.id);
      }

      await user.update({ history: copyUserHistory, });
      await video.update({ views: video.views + 1, });

      return res.status(200).json({ ok: true, status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Adds a video rating from the user
  async setRate(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", type: "error", status: 403, });
      }

      const { params: { id, }, query: { isLike, }, } = req;

      if (!id || isNaN(+id) || typeof JSON.parse(isLike || "") !== "boolean") {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const video = await VideoModel.findOne({ where: { id, }, });

      if (!video) {
        return res.status(404).json({ ok: false, message: "Такого видео не существует", status: 404, type: "error", });
      }

      const userLikedThisVideo = video.likes.includes(req.userId);
      const userDislikedThisVideo = video.dislikes.includes(req.userId);
      const copyLikesVideo = [...video.likes];
      const copyDislikesVideo = [...video.dislikes];
      const ratingMethodOptions = {
        req,
        res,
        userLikedThisVideo,
        userDislikedThisVideo,
        video,
        copyLikesVideo,
        copyDislikesVideo,
      };

      // The user gave a positive rating
      if (JSON.parse(isLike)) {
        const { posRating = false, dislikesVideo, likesVideo, } = await setLike(ratingMethodOptions);

        return res.status(200).json({
          ok: true,
          positiveRating: posRating,
          negativeRating: false,
          likes: likesVideo.length,
          dislikes: dislikesVideo.length,
          status: 200,
          type: "success",
        });
      }

      // The user gave a negative rating
      const { negRating = false, dislikesVideo, likesVideo, } = await setDislike(ratingMethodOptions);

      return res.status(200).json({
        ok: true,
        positiveRating: false,
        negativeRating: negRating,
        likes: likesVideo.length,
        dislikes: dislikesVideo.length,
        status: 200,
        type: "success",
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Edit video data
  async edit(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", type: "error", status: 403, });
      }

      const { id, } = req.params;
      const body = req.body;
      const files = req.files || {};
      const optionalParams = ["title", "description", "video", "poster", "time", "duration"];

      if (!id || isNaN(id) || !Object.keys({ ...body, ...files, }).some((key) => optionalParams.includes(key))) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const video = await VideoModel.findOne({ where: { id, }, });

      if (!video) {
        return res.status(404).json({ ok: false, message: "Такого видео не существует", status: 404, type: "error", });
      }

      if (video.userId !== req.userId) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для редатирования этого видео", status: 403, type: "error", });
      }

      // This is where the data to be edited is stored
      const videoData = body;
      const { poster: posterFile = [], video: videoFile = [], } = files;

      if (posterFile.length) {
        videoData.poster = posterFile[0].filename;

        // Delete the old poster file
        await removeFile([__dirname, "../../", process.env.VIDEO_DATA_FILES_FOLDER, video.poster], res);
      }

      if (videoFile.length) {
        videoData.src = videoFile[0].filename;

        // Delete old video file
        await removeFile([__dirname, "../../", process.env.VIDEO_DATA_FILES_FOLDER, video.src], res);
      }

      await video.update(videoData);

      return res.status(200).json({ ok: true, message: "Видео отредактировано", status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }
}

module.exports = new Video();