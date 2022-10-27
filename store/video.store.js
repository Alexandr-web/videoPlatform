const host = require("../server/host");

export default {
  actions: {
    async load({}, { fd, token, }) {
      try {
        const res = await fetch(`${host}/video/load`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: fd,
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    async getAll() {
      try {
        const res = await fetch(`${host}/video/api`, {
          method: "GET",
          headers: { "Accept-Type": "application/json", },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },
  },
};