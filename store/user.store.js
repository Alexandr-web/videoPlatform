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
        const res = await fetch(`${host}/user/api/${id}`, {
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
    async getVideos({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/user/api/${id}/videos`, {
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
        const res = await fetch(`${host}/user/api/${id}/followers`, {
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
        const res = await fetch(`${host}/user/api/${id}/followings`, {
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
        const res = await fetch(`${host}/user/${id}/edit`, {
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
        const res = await fetch(`${host}/user/${currentUserId}/following/${followingUserId}`, {
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
  },
};