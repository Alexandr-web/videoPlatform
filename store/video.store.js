const host = require("../server/host");

export default {
  state: () => ({
    video: null,
    isPlay: false,
    mute: false,
    volume: 0.5,
    fullscreen: false,
  }),
  mutations: {
    setVideo(state, val) {
      state.video = val;
    },
    clearVideo(state) {
      state.video = null;
    },
    setPlay(state, val) {
      state.isPlay = val;
    },
    setFullscreen(state, val) {
      state.fullscreen = val;
    },
    setMute(state, val) {
      state.mute = val;

      localStorage.setItem("mute", val);
    },
    setVolume(state, val) {
      state.volume = val;

      localStorage.setItem("volume", val);
    },
  },
  getters: {
    getVideo: (state) => state.video,
    getPlay: (state) => state.isPlay,
    getFullscreen: (state) => state.fullscreen,
    getMute: (state) => state.mute,
    getVolume: (state) => state.volume,
  },
  actions: {
    /**
     * Sends a request to register a video view
     * @param {string|number} videoId id of the video to register a new view
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async setView({ }, { videoId, token, }) {
      try {
        const res = await fetch(`${host}/video/${videoId}/view`, {
          method: "PUT",
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
     * Sends a request to upload a video
     * @param {object} fd Form data containing the required parameters for uploading a video
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async load({ }, { fd, token, }) {
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

    // Gets all videos from the database
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

    /**
     * Get video by id
     * @param {string} token User token
     * @param {string|number} id Id of the video we want to get
     * @returns {promise} Request result
     */
    async getOne({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/video/api/${id}`, {
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
     * Submits a request for video rating
     * @param {string} token User token
     * @param {string|number} id Video id 
     * @param {boolean} isLike The user liked the video
     * @returns {promise} Request result
     */
    async setRate({ }, { token, id, isLike, }) {
      try {
        const res = await fetch(`${host}/video/${id}/rate?isLike=${isLike}`, {
          method: "PUT",
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
     * Submits a video editing request
     * @param {string} token User token
     * @param {string|number} id Video if
     * @param {object} fd Data to be edited
     * @returns {promise} Request result
     */
    async edit({ }, { token, id, fd, }) {
      try {
        const res = await fetch(`${host}/video/${id}/edit`, {
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
     * Sends a request to delete a video by id
     * @param {string} token User token
     * @param {number|string} id Video id 
     * @returns {promise} Request result
     */
    async remove({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/video/${id}/delete`, {
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
  },
};