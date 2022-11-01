<template>
  <div class="profile-page pt-120 pb-20">
    <div class="profile-page__inner">
      <vProfileHeader
        v-if="Object.keys(user).length"
        :user="user"
      />
      <div class="profile-page__content">
        <header class="profile__content-header">
          <div class="container">
            <nav class="profile__nav">
              <ul
                v-if="isGuest"
                class="profile__nav-list"
              >
                <li
                  v-for="(item, index) in getNavListForGuest"
                  :key="index"
                  class="profile__nav-list-item"
                >
                  <nuxt-link
                    class="profile__nav-list-link"
                    :to="item.to"
                    exact-active-class="profile__nav-list-link--active"
                  >{{ item.name }}</nuxt-link>
                </li>
              </ul>
              <ul
                v-else
                class="profile__nav-list"
              >
                <li
                  v-for="(item, index) in navList"
                  :key="index"
                  class="profile__nav-list-item"
                >
                  <nuxt-link
                    class="profile__nav-list-link"
                    :to="item.to"
                    exact-active-class="profile__nav-list-link--active"
                  >{{ item.name }}</nuxt-link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
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
      const possibleQueryWaysForOwner = ["videos", "settings", "controls", "channels"];

      return res
        .then(({ ok, user, }) => {
          if (currentUser.id !== +id) {
            return [ok, user, possibleQueryWaysForGuest.includes(tab)].every(Boolean);
          }

          return [ok, user, possibleQueryWaysForOwner.includes(tab)].every(Boolean);
        })
        .catch((err) => {
          throw err;
        });
    },
    data: () => ({
      user: {},
      isGuest: true,
      navList: [
        {
          name: "Видео",
          to: "?tab=videos",
        },
        {
          name: "Настройки",
          to: "?tab=settings",
          onlyOwner: true,
        },
        {
          name: "Управление",
          to: "?tab=controls",
          onlyOwner: true,
        },
        {
          name: "Каналы",
          to: "?tab=channels",
        }
      ],
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
    head: { title: "Профиль", },
    computed: {
      getCurrentUser() {
        return this.$store.getters["user.store/getUser"];
      },
      getNavListForGuest() {
        return this.navList.filter(({ onlyOwner, }) => !onlyOwner);
      },
    },
  };
</script>