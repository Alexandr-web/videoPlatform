<template>
  <div class="profile-page pt-120 pb-20">
    <div class="container">
      <div class="profile-page__inner">
        <vProfileHeader
          v-if="Object.keys(user).length"
          :user="user"
          :is-guest="isGuest"
        />
        <div class="profile-page__tabs">
          <vProfileVideos
            v-if="$route.query.tab === 'videos' && Object.keys(user).length"
            :user="user"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vProfileHeader from "@/components/vProfileHeader";
  import vProfileVideos from "@/components/vProfileVideos";
  import getValidAvatarUrlMixin from "@/mixins/getValidAvatarUrl";

  export default {
    name: "ProfilePage",
    components: {
      vProfileHeader,
      vProfileVideos,
    },
    mixins: [getValidAvatarUrlMixin],
    layout: "default",
    validate({ store, params: { id, }, query: { tab, }, }) {
      if (isNaN(+id)) {
        return false;
      }

      const res = store.dispatch("user.store/getOne", id);
      const possibleWays = ["videos", "settings", "controls", "channels"];

      return res
        .then(({ ok, user, }) => [ok, user, possibleWays.includes(tab)].every(Boolean))
        .catch((err) => {
          throw err;
        });
    },
    data: () => ({
      user: {},
      isGuest: true,
    }),
    async fetch() {
      try {
        const { id, } = this.$route.params;
        const { ok, user, } = await this.$store.dispatch("user.store/getOne", id);

        if (ok) {
          const avatar = await this.getValidAvatarUrl(user.avatar);

          this.user = {
            ...user,
            avatar,
          };
          this.isGuest = this.getCurrentUser.id !== user.id;
        }
      } catch (err) {
        throw err;
      }
    },
    computed: {
      getCurrentUser() {
        return this.$store.getters["user.store/getUser"];
      },
    },
  };
</script>