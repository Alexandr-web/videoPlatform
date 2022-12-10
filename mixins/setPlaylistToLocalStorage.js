export default {
  methods: {
    // Set a playlist to local storage
    setPlaylistToLocalStorage(videos) {
      localStorage.setItem("playlistVideos", JSON.stringify(videos));
    },
  },
};