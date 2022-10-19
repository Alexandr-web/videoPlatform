export default {
  computed: {
    getUser() {
      return this.$store.getters["user.store/getUser"];
    },
  },
  methods: {
    async getValidAvatarUrl(path) {
      if (/^\/\_nuxt\//.test(path)) {
        return path;
      }

      const url = await require(`@/avatars/${path}`);

      return /^\/\_nuxt\//.test(url) ? url : "";
    },
  },
  mounted() {
    this.getValidAvatarUrl(this.getUser.avatar)
      .then((url) => {
        this.$store.commit("user.store/setUser", {
          ...this.getUser,
          avatar: url,
        });
      }).catch((err) => {
        throw err;
      });
  },
};