import jsCookie from "js-cookie";
import jwtDecode from "jwt-decode";

const host = require("../server/host");
const Cookie = require("cookie");

export default {
  state: () => ({ token: null, }),
  getters: { getToken: (state) => state.token, },
  mutations: {
    setToken(state, val) {
      state.token = val;

      jsCookie.set("token", val);
    },
    clearToken(state) {
      state.token = null;

      jsCookie.remove("token");
    },
  },
  actions: {
    async autoLogin({ commit, }) {
      try {
        const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie || "";
        const findToken = Cookie.parse(cookieStr);

        if (findToken) {
          const isValidToken = (tkn) => {
            if (!tkn) {
              return false;
            }

            const tokenData = jwtDecode(tkn) || {};
            const expires = tokenData.exp || 0;

            return (new Date().getTime() / 1000) < expires;
          };

          return isValidToken(findToken.token) ? commit("setToken", findToken.token) : commit("clearToken");
        }

        return commit("clearToken");
      } catch (err) {
        throw err;
      }
    },
  },
};