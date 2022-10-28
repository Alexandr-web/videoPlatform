<template>
  <header class="profile__header">
    <div class="container">
      <div class="profile__header-inner">
        <div class="profile__header-top">
          <div class="profile__header-background"></div>
          <div class="profile__header-avatar">
            <img
              class="profile__header-avatar-image"
              :src="user.avatar"
            >
          </div>
          <div class="profile__header-nickname">
            {{ user.nickname }}
          </div>
        </div>
        <div class="profile__header-bottom">
          <nav class="profile__header-nav">
            <ul
              v-if="isGuest"
              class="profile__header-list"
            >
              <li
                v-for="(item, index) in getNavListForGuest"
                :key="index"
                class="profile__header-list-item"
              >
                <nuxt-link
                  class="profile__header-list-link"
                  :to="item.to"
                  exact-active-class="profile__header-list-link--active"
                >
                  {{ item.name }}
                </nuxt-link>
              </li>
            </ul>
            <ul
              v-else
              class="profile__header-list"
            >
              <li
                v-for="(item, index) in navList"
                :key="index"
                class="profile__header-list-item"
              >
                <nuxt-link
                  class="profile__header-list-link"
                  :to="item.to"
                  exact-active-class="profile__header-list-link--active"
                >
                  {{ item.name }}
                </nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    name: "ProfileHeaderComponent",
    props: {
      user: {
        type: Object,
        required: true,
      },
      isGuest: {
        type: Boolean,
        required: true,
      },
    },
    data: () => ({
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
    computed: {
      getNavListForGuest() {
        return this.navList.filter(({ onlyOwner, }) => !onlyOwner);
      },
    },
  };
</script>