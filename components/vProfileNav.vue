<template>
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
</template>

<script>
  export default {
    name: "ProfileNavComponent",
    props: {
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