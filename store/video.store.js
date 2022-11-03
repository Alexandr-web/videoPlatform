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
    },
    setVolume(state, val) {
      state.volume = val;
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
  },
};