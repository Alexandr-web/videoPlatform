<template>
  <div class="profile-page pt-120 pb-20">
    <div class="profile-page__inner">
      <vProfileHeader
        v-if="Object.keys(user).length"
        :user="user"
        :is-guest="isGuest"
        :following-id="user.id"
        :is-follow="isFollow"
      />
      <div class="profile-page__content">
        <vProfileNav :is-guest="isGuest" />
        <div
          v-if="Object.keys(user).length"
          class="container"
        >
          <vProfileVideos
            v-if="$route.query.tab === 'videos'"
            :user="user"
          />
          <vProfileSettings
            v-if="$route.query.tab === 'settings' && !isGuest"
            :user="user"
          />
          <vProfileChannels
            v-if="$route.query.tab === 'channels'"
            :user="user"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vProfileHeader from "@/components/vProfileHeader";
  import vProfileNav from "@/components/vProfileNav";
  import vProfileVideos from "@/components/vProfileVideos";
  import vProfileSettings from "@/components/vProfileSettings";
  import vProfileChannels from "@/components/vProfileChannels";
  import getValidAvatarUrlMixin from "@/mixins/getValidAvatarUrl";

  export default {
    name: "ProfilePage",
    components: {
      vProfileHeader,
      vProfileVideos,
      vProfileSettings,
      vProfileChannels,
      vProfileNav,
    },
    mixins: [getValidAvatarUrlMixin],
    layout: "default",
    validate({ store, params: { id, }, query: { tab, }, }) {
      if (isNaN(+id)) {
        return false;
      }

      const res = store.dispatch("user.store/getOne", id);
      const currentUser = store.getters["user.store/getUser"];
      const possibleQueryWaysForGuest = ["videos", "channels"];
      const possibleQueryWaysForOwner = ["videos", "settings", "channels"];

      return res
        .then(({ ok, user, }) => {
          return [ok, user, (currentUser.id !== +id ? possibleQueryWaysForGuest : possibleQueryWaysForOwner).includes(tab)].every(Boolean);
        })
        .catch((err) => {
          throw err;
        });
    },
    data: () => ({
      user: {},
      isFollow: false,
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
          this.isFollow = user.followersId.includes(this.getCurrentUser.id);
        }
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Профиль", },
    computed: {
      getCurrentUser() {
        return this.$store.getters["user.store/getUser"];
      },
    },
  };
</script>