const UserModel = require("../models/User.model");
const Video = require("../models/Video.model");
const removeFile = require("../helpers/removeFile");
const bcrypt = require("bcrypt");
const { Op, } = require("sequelize");

class User {
  // Get user by id
  async getOne(req, res) {
    try {
      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const user = await UserModel.findOne({ where: { id, }, });

      // We get everything except the password
      const userData = user ? Object
        .keys(user.dataValues)
        .reduce((acc, key) => {
          if (key !== "password") {
            acc[key] = user.dataValues[key];
          }

          return acc;
        }, {}) : null;

      return res.status(200).json({ ok: true, user: userData, status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Getting a user's video by its id
  async getVideos(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { id, } = req.params;
      const { search, } = req.query;

      if (!id || isNaN(+id) || search === undefined) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const defaultFindParams = { userId: id, };

      // Options by which we will search for videos
      const findParams = Object.keys(defaultFindParams).reduce((acc, key) => {
        // The data must match the search
        if (search.length > 2) {
          acc[Op.or] = [
            { title: { [Op.substring]: search, }, },
            { description: { [Op.substring]: search, }, }
          ];
        }

        acc[key] = defaultFindParams[key];

        return acc;
      }, {});

      const allVideos = await Video.findAll({ where: findParams, });
      const validVideos = allVideos.map(({ dataValues, }) => dataValues);

      return res.status(200).json({ ok: true, videos: validVideos, status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Getting followers of a user
  async getFollowers(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const user = await UserModel.findOne({ where: { id, }, });

      if (!user) {
        return res.status(404).json({ ok: false, message: "Такого пользователя не существует", status: 404, type: "error", });
      }

      const followersPromises = user.followersId.map((followerId) => UserModel.findOne({ where: { id: followerId, }, }));

      return Promise.all(followersPromises)
        .then((followers) => {
          // We take only nickname, id, followersId, avatar
          const validFollowers = followers.map(({ nickname, id: followerId, followersId, avatar, }) => {
            return { nickname, id: followerId, followersId, avatar, };
          });

          return res.status(200).json({ ok: true, followers: validFollowers, status: 200, type: "success", });
        }).catch((err) => {
          console.log(err);

          return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
        });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Getting followings of a user
  async getFollowings(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const user = await UserModel.findOne({ where: { id, }, });

      if (!user) {
        return res.status(404).json({ ok: false, message: "Такого пользователя не существует", status: 404, type: "error", });
      }

      const allUsers = await UserModel.findAll();

      // We take only nickname, id, followersId, avatar
      const followings = allUsers
        .filter(({ followersId, }) => followersId.includes(+id))
        .map(({ nickname, id: followingId, followersId, avatar, }) => {
          return { nickname, id: followingId, followersId, avatar, };
        });

      return res.status(200).json({ ok: true, followings, status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Changing user data
  async edit(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { id, } = req.params;
      const body = req.body;
      const bodyKeys = Object.keys(body);
      const file = req.file;

      // When requesting, there must be required data
      if (!id || isNaN(+id) || !bodyKeys.length || (!bodyKeys.some((key) => ["nickname", "email", "password"].includes(key)) && !file)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const user = await UserModel.findOne({ where: { id, }, });

      if (!user) {
        return res.status(404).json({ ok: false, message: "Такого пользователя не существует", status: 404, type: "error", });
      }

      if (user.id !== req.userId) {
        return res.status(403).json({ ok: false, message: "Нет доступа", status: 403, type: "error", });
      }

      // All data that needs to be changed will be stored here.
      const userData = {};

      bodyKeys.map((key) => {
        if (key !== "password") {
          userData[key] = body[key];
        }
      });

      if ("password" in body) {
        // Setting a hashed password
        userData.password = await bcrypt.hash(body.password, 7);
      }

      // If there is a file, then delete the old one
      if (file) {
        await removeFile([__dirname, "../../", process.env.AVATARS_FILES_FOLDER, user.avatar], res);

        userData.avatar = file.filename;
      }

      await user.update(userData);

      return res.status(200).json({ ok: true, message: "Изменения успешно сохранены", status: 200, userData, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Follow the user
  async setFollowing(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { followingUserId, currentUserId, } = req.params;

      if (!currentUserId || !followingUserId || [+currentUserId, +followingUserId].some(isNaN)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      if (followingUserId === currentUserId) {
        return res.status(403).json({ ok: false, message: "Нельзя следить за собой", status: 403, type: "error", });
      }

      const currentUser = await UserModel.findOne({ where: { id: currentUserId, }, });
      const followingUser = await UserModel.findOne({ where: { id: followingUserId, }, });

      if (!currentUser || !followingUser) {
        return res.status(404).json({ ok: false, message: "Одного из пользователей не существует", status: 404, type: "error", });
      }

      let copyFollowingUserFollowersId = [...followingUser.followersId];

      const alreadyFollowing = copyFollowingUserFollowersId.includes(+currentUserId);

      let isFollowing = false;

      if (alreadyFollowing) {
        // Unsubscribe the user from the channel if he is already subscribed to it
        copyFollowingUserFollowersId = copyFollowingUserFollowersId.filter((id) => id !== +currentUserId);
      } else {
        // Signing if not already signed
        copyFollowingUserFollowersId.push(+currentUserId);

        isFollowing = true;
      }

      await followingUser.update({ followersId: copyFollowingUserFollowersId, });

      return res.status(200).json({ ok: true, status: 200, type: "success", isFollowing, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Gets the user's history
  async getHistory(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { id, } = req.params;
      const { search, } = req.query;

      if (!id || isNaN(+id) || search === undefined) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const user = await UserModel.findOne({ where: { id, }, });

      if (!user) {
        return res.status(404).json({ ok: false, message: "Такого пользователя не существует", status: 404, type: "error", });
      }

      // We get promises with videos and their authors
      const promises = user.history.map(async (videoId) => {
        try {
          const defaultFindOptions = { id: videoId, };

          // Options by which we will search for videos
          const videoFindOptions = Object.keys(defaultFindOptions).reduce((videoOpt, key) => {
            // The data must match the search
            if (search.length > 2) {
              videoOpt[Op.or] = [
                { title: { [Op.substring]: search, }, },
                { description: { [Op.substring]: search, }, }
              ];
            }

            videoOpt[key] = defaultFindOptions[key];

            return videoOpt;
          }, {});

          const video = await Video.findOne({ where: videoFindOptions, });

          if (video) {
            const author = await UserModel.findOne({ where: { id: video.userId, }, });

            return {
              ...video.dataValues,
              author: {
                id: author.id,
                nickname: author.nickname,
              },
            };
          }

          return false;
        } catch (err) {
          console.log(err);

          return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
        }
      });

      return Promise.all(promises)
        .then((videos) => {
          return res.status(200).json({ ok: true, videos: videos.filter(Boolean), status: 200, type: "success", });
        }).catch((err) => {
          console.log(err);

          return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
        });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // Gets the user's liked videos by their id
  async getFavorites(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { id: userId, } = req.params;
      const { search, } = req.query;

      if (!userId || isNaN(+userId) || search === undefined) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const user = await UserModel.findOne({ where: { id: userId, }, });

      if (!user) {
        return res.status(404).json({ ok: false, message: "Такого пользователя не существует", status: 404, type: "error", });
      }

      const defaultFindOptions = { likes: { [Op.contains]: [+userId], }, };

      // Options by which we will search for videos
      const findOptions = Object.keys(defaultFindOptions).reduce((acc, key) => {
        // The data must match the search
        if (search.length > 2) {
          acc[Op.or] = [
            { title: { [Op.substring]: search, }, },
            { description: { [Op.substring]: search, }, }
          ];
        }

        acc[key] = defaultFindOptions[key];

        return acc;
      }, {});

      const likedVideos = await Video.findAll({ where: findOptions, });

      if (!likedVideos.length) {
        return res.status(200).json({ ok: true, videos: [], status: 200, type: "success", });
      }

      // We collect videos together with their authors
      const promises = likedVideos.map((video) => {
        return UserModel.findOne({ where: { id: video.userId, }, })
          .then(({ id, nickname, }) => ({
            ...video.dataValues,
            author: {
              id,
              nickname,
            },
          })).catch((err) => {
            console.log(err);

            return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
          });
      });

      return Promise.all(promises)
        .then((videos) => {
          return res.status(200).json({ ok: true, videos, status: 200, type: "success", });
        }).catch((err) => {
          console.log(err);

          return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
        });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }
}

module.exports = new User();