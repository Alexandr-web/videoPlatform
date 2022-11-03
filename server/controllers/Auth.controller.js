const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class Auth {
  // User registration in the system
  async registration(req, res) {
    try {
      const body = req.body;

      // When requesting, there must be required data
      if (!Object.keys(body).every((key) => ["nickname", "email", "password"].includes(key)) || !req.file) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const { email, password, } = body;
      const user = await User.findOne({ where: { email, }, });

      if (user) {
        return res.status(400).json({ ok: false, message: "Такой пользователь уже существует", status: 400, type: "error", });
      }

      // Adding a hashed password
      const hashPassword = await bcrypt.hash(password, 7);
      const userData = {
        ...body,
        password: hashPassword,
        avatar: req.file.filename,
      };

      await User.create(userData);

      return res.status(200).json({ ok: true, message: "Вы успешно зарегистрировались", status: 200, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }

  // User login and creation of his personal token
  async login(req, res) {
    try {
      const body = req.body;

      // When requesting, there must be required data
      if (!Object.keys(body).every((key) => ["email", "password"].includes(key))) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, type: "error", });
      }

      const { email, password, } = body;
      const user = await User.findOne({ where: { email, }, });

      if (!user) {
        return res.status(404).json({ ok: false, message: "Такого пользователя не существует", status: 404, type: "error", });
      }

      const isTruePassword = await bcrypt.compare(password, user.password);

      if (!isTruePassword) {
        return res.status(400).json({ ok: false, message: "Неверный пароль", status: 400, type: "error", });
      }

      // We save all data in the token, except for the password
      const userData = Object
        .keys(user.dataValues)
        .reduce((acc, key) => {
          if (key !== "password") {
            acc[key] = user.dataValues[key];
          }

          return acc;
        }, {});
      const token = jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60), });

      return res.status(200).json({ ok: true, message: "Вы успешно вошли", status: 200, token: `Bearer ${token}`, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
    }
  }
}

module.exports = new Auth();