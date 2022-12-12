const toobusy = require("toobusy-js");

module.exports = async (req, res, next) => {
  try {
    if (toobusy()) {
      return res.status(503).json({ ok: false, message: "Сервер перегружен, зайдите позже", status: 503, type: "error", });
    }

    next();
  } catch (err) {
    console.log(err);

    return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
  }
};