export default {
  data: () => ({
    follow: false,
    pendingFollowing: false,
  }),
  computed: {
    getUser() {
      return this.$store.getters["user.store/getUser"];
    },
    getToken() {
      return this.$store.getters["auth.store/getToken"];
    },
  },
  methods: {
    /**
     * Sets a follow to a user
     * @param {string|number} followingId The id of the user we want to follow
     * @returns {promise} Request result
     */
    setFollow(followingId) {
      const token = this.getToken;
      const { id, } = this.getUser;
      const res = this.$store.dispatch("user.store/setFollowing", { token, currentUserId: id, followingUserId: followingId, });

      this.pendingFollowing = true;

      res.then(({ isFollowing, }) => {
        this.pendingFollowing = false;
        this.follow = isFollowing;
      }).catch((err) => {
        throw err;
      });
    },
  },
};