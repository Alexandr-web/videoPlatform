import jwtDecode from "jwt-decode";

const host = require("../server/host");

export default {
  state: () => ({ user: null, }),
  getters: { getUser: (state) => state.user, },
  mutations: {
    setUser(state, val) {
      state.user = val;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  actions: {
    async getOne({}, id) {
      try {
        const res = await fetch(`${host}/user/${id}`, {
          method: "GET",
          headers: { "Accept-Type": "application/json", },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    async getOneByToken({}, token) {
      try {
        return jwtDecode(token);
      } catch (err) {
        throw err;
      }
    },
  },
};