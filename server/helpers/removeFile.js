const fs = require("fs");
const path = require("path");

/**
 * Removes a file from a directory
 * @param {array} slicePath An array consisting of parts of the entire path that leads to the directory ([__dirname, "../../", "folder", "file.jpg")
 * @param {object} res Response express object
 */
module.exports = async (slicePath, res) => {
  try {
    const filePath = path.resolve(...slicePath);

    if (await fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);

          return res.status(500).json({ ok: false, message: "Произошла ошибка при удалении файла", type: "error", });
        }
      });
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({ ok: false, message: "Произошла ошибка при удалении файлов", type: "error", });
  }
};