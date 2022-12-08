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
    /**
     * Gets a user by their id
     * @param {number|string} id Id of the user who will be searched for in the database
     * @returns {promise} Request result
     */
    async getOne({ }, id) {
      try {
        const res = await fetch(`${host}/api/user/${id}`, {
          method: "GET",
          headers: { "Accept-Type": "application/json", },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Gets all user videos
     * @param {string} token User Token
     * @param {number|string} id User id
     * @returns {promise} Request result
     */
    async getVideos({ }, { token, id, search, }) {
      try {
        const res = await fetch(`${host}/api/user/${id}/videos?search=${search || ""}`, {
          method: "GET",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Gets the user's followers
     * @param {string} token User Token
     * @param {number|string} id User id
     * @returns {promise} Request result
     */
    async getFollowers({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/api/user/${id}/followers`, {
          method: "GET",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Gets the user's followings
     * @param {string} token User Token
     * @param {number|string} id User id
     * @returns {promise} Request result
     */
    async getFollowings({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/api/user/${id}/followings`, {
          method: "GET",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Gets data from a token
     * @param {string} token User Token
     * @returns {promise} Promise containing token data
     */
    async getOneByToken({ }, token) {
      try {
        return jwtDecode(token);
      } catch (err) {
        throw err;
      }
    },

    /**
     * Sends a request to change user data
     * @param {string} token User Token
     * @param {object} fd Form data containing the necessary parameters for editing user data
     * @param {number|string} id User id
     * @returns {promise} Request result
     */
    async edit({ }, { token, fd, id, }) {
      try {
        const res = await fetch(`${host}/api/user/${id}/edit`, {
          method: "PUT",
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

    /**
     * Sends a following request
     * @param {string} token User Token
     * @param {string|number} currentUserId id of the user who wants to follow
     * @param {string|number} followingUserId id of the user he want to follow
     * @returns {promise} Request result
     */
    async setFollowing({ }, { token, currentUserId, followingUserId, }) {
      try {
        const res = await fetch(`${host}/api/user/${currentUserId}/following/${followingUserId}`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Sends a request to get a user's history
     * @param {string} token User token
     * @param {number|string} id User id
     * @param {string} search We take a video, by this value
     * @returns {promise} Request result
     */
    async getHistory({ }, { token, id, search, }) {
      try {
        const res = await fetch(`${host}/api/user/${id}/history?search=${search}`, {
          method: "GET",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Sends a request to get liked videos
     * @param {string} token User token
     * @param {string|number} id User id
     * @returns {promise} Request result
     */
    async getFavorites({ }, { token, id, search, }) {
      try {
        const res = await fetch(`${host}/api/user/${id}/favorites?search=${search}`, {
          method: "GET",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Gets a valid avatar url
     * @param {string} path original path
     * @return {string} valid url avatar
     */
    async getValidAvatarUrl({ }, path) {
      try {
        if (/^\/\_nuxt\//.test(path)) {
          return path;
        }

        return require(`@/avatars/${path}`);
      } catch (err) {
        throw err;
      }
    },
  },
};