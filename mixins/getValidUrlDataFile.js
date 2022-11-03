/**
 * Gets valid url of the video file or poster
 * @param {string} path url
 * @return {string} valid data file
 */
export default {
  methods: {
    async getValidUrlDataFile(path) {
      if (/^\/\_nuxt\//.test(path)) {
        return path;
      }

      const url = await require(`@/videoDataFiles/${path}`);

      return /^\/\_nuxt\//.test(url) ? url : "";
    },
  },
};