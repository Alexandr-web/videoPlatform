const UserModel = require("../models/User.model");

class User {
  async getOne(req, res) {
    try {
      const { id, } = req.params;

      if (isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", status: 400, });
      }

      const user = await UserModel.findOne({ where: { id, }, });
      const userData = Object
        .keys(user.dataValues)
        .reduce((acc, key) => {
          if (key !== "password") {
            acc[key] = user.dataValues[key];
          }
          
          return acc;
        }, {});

      return res.status(200).json({ ok: true, user: userData, status: 200, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, });
    }
  }
}

module.exports = new User();