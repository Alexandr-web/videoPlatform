const host = require("../server/host");

export default {
  state: () => ({
    playlist: {},
    listVideos: [],
  }),
  getters: {
    getPlaylist: (state) => state.playlist,
    getListVideos: (state) => state.listVideos,
  },
  mutations: {
    setPlaylist(state, val) {
      state.playlist = val;
    },
    setListVideos(state, val) {
      state.listVideos = val;
    },
  },
  actions: {
    /**
     * Sending a request to the server to get a playlist by its id
     * @param {string} token User token
     * @param {number|string} id Playlist id
     * @returns {promise} Request result
     */
    async getOne({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/api/playlist/${id}`, {
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
     * Sends a request to get a video playlist by its id
     * @param {string} token User token
     * @param {string|number} id Playlist id
     * @returns {promise} Request result
     */
    async getVideos({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/api/playlist/${id}/videos`, {
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
     * Sends a request to add a playlist
     * @param {string} token User token
     * @param {object} fd Form data required to create a playlist
     * @return {promise} Request result
     */
    async add({ }, { token, fd, }) {
      try {
        const res = await fetch(`${host}/api/playlist/add`, {
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

    /**
     * Sends a request to delete a playlist by its id
     * @param {string} token User token
     * @param {string|number} id Playlist id
     * @returns {promise} Request result
     */
    async remove({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/api/playlist/${id}/remove`, {
          method: "DELETE",
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
     * Gets valid url of the playlist poster
     * @param {string} path url
     * @return {string} valid data file
     */
    async getValidUrlPlaylistPoster({ }, path) {
      if (/^\/\_nuxt\//.test(path)) {
        return path;
      }

      return require(`@/playlistPosters/${path}`);
    },
  },
};