const db = require("./db");

module.exports = async () => {
  try {
    await db.authenticate();
    await db.sync();

    console.log("Connection has been established successfully.");
  } catch (err) {
    console.log(err);
  }
};