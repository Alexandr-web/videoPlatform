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