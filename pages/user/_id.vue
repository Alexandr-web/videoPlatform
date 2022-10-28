<template>
  <div class="profile-page pt-120 pb-20">
    <div class="container">
      <div class="profile-page__inner">
        <vProfileHeader
          v-if="Object.keys(user).length"
          :user="user"
          :is-guest="isGuest"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import vProfileHeader from "@/components/vProfileHeader";
  import getValidAvatarUrlMixin from "@/mixins/getValidAvatarUrl";

  export default {
    name: "ProfilePage",
    components: { vProfileHeader, },
    mixins: [getValidAvatarUrlMixin],
    layout: "default",
    validate({ store, params: { id, }, }) {
      if (isNaN(+id)) {
        return false;
      }

      const res = store.dispatch("user.store/getOne", id);

      return res
        .then(({ ok, user, }) => [ok, user].every(Boolean))
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