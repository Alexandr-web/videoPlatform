const UserModel = require("../models/User.model");
const Video = require("../models/Video.model");
const removeFile = require("../helpers/removeFile");
const bcrypt = require("bcrypt");

class User {
  async getOne(req, res) {
    try {
      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const user = await UserModel.findOne({ where: { id, }, });
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

  async getVideos(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const allVideos = await Video.findAll({ where: { userId: id, }, });
      const validVideos = allVideos.map(({ dataValues, }) => dataValues);

      return res.status(200).json({ ok: true, videos: validVideos, status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

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

  async edit(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { id, } = req.params;
      const body = req.body;
      const file = req.file;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      if (!Object.keys(body).some((key) => ["nickname", "email", "password"].includes(key)) && !file) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const user = await UserModel.findOne({ where: { id, }, });

      if (!user) {
        return res.status(404).json({ ok: false, message: "Такого пользователя не существует", status: 404, type: "error", });
      }

      if (user.id !== req.userId) {
        return res.status(403).json({ ok: false, message: "Нет доступа", status: 403, type: "error", });
      }

      const userData = {};

      Object.keys(body).map((key) => {
        if (key !== "password") {
          userData[key] = body[key];
        }
      });

      if ("password" in body) {
        userData.password = await bcrypt.hash(body.password, 7);
      }

      if (file) {
        await removeFile([__dirname, "../../", "avatars", user.avatar], res);

        userData.avatar = file.filename;
      }

      await user.update(userData);

      return res.status(200).json({ ok: true, message: "Изменения успешно сохранены", status: 200, userData, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  async setFollowing(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно авторизоваться", status: 403, type: "error", });
      }

      const { followingUserId, currentUserId, } = req.params;

      if (!currentUserId || !followingUserId || [+currentUserId, +followingUserId].some(isNaN)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
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
        copyFollowingUserFollowersId = copyFollowingUserFollowersId.filter((id) => id !== +currentUserId);
      } else {
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
}

module.exports = new User();