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
          <vProfileHistory
            v-if="$route.query.tab === 'history'"
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
  import vProfileHistory from "@/components/vProfileHistory";

  export default {
    name: "ProfilePage",
    components: {
      vProfileHeader,
      vProfileVideos,
      vProfileSettings,
      vProfileChannels,
      vProfileNav,
      vProfileHistory,
    },
    layout: "default",
    validate({ store, params: { id, }, query: { tab, }, }) {
      if (isNaN(+id)) {
        return false;
      }

      const res = store.dispatch("user.store/getOne", id);
      const currentUser = store.getters["user.store/getUser"];
      const queryForGuest = ["videos", "channels"];
      const queryForOwner = ["videos", "settings", "channels", "history", "search", "myVideos"];

      return res
        .then(({ ok, user, }) => {
          return [ok, user, (currentUser.id !== +id ? queryForGuest : queryForOwner).includes(tab)].every(Boolean);
        })
        .catch((err) => {
          throw err;
        });
    },
    // Getting a user by id
    async asyncData({ store, params: { id: userId, }, }) {
      try {
        const { ok, user, } = await store.dispatch("user.store/getOne", userId);

        if (!ok) {
          return {
            user: {},
            isGuest: false,
            isFollow: false,
          };
        }

        const avatar = await store.dispatch("user.store/getValidAvatarUrl", user.avatar);
        const currentUser = store.getters["user.store/getUser"];

        return {
          user: {
            ...user,
            avatar,
          },
          // Whether the user retrieved from the server is a guest
          isGuest: currentUser.id !== user.id,
          // Whether the current user is subscribed to the user received from the server
          isFollow: user.followersId.includes(currentUser.id),
        };
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Профиль", },
  };
</script>