<template>
  <header class="header">
    <div class="container">
      <nav class="header__nav">
        <div class="header__block header__search">
          <input
            v-model.trim="search"
            class="header__search-input"
            type="text"
            placeholder="Поиск"
          >
          <button class="header__search-btn">
            <vSearchIcon :classes="['header__search-icon']" />
          </button>
        </div>
        <div class="header__block header__menu">
          <ul class="header__menu-list">
            <li
              v-for="(item, index) in menu"
              :key="index"
              class="header__menu-item"
            >
              <nuxt-link
                class="header__menu-link"
                exact-active-class="header__menu-link--active"
                :to="item.to"
              >{{ item.title }}</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="header__block header__user">
          <nuxt-link
            class="header__user-avatar"
            :to="`/user/${getUser.id}?tab=videos`"
          >
            <img
              class="header__user-avatar-image"
              :src="getUser.avatar"
              :alt="getUser.nickname"
            >
          </nuxt-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
  import vSearchIcon from "@/components/icons/vSearchIcon";

  export default {
    name: "HeaderComponent",
    components: { vSearchIcon, },
    data: () => ({
      menu: [
        {
          title: "Главная",
          to: "/",
        },
        {
          title: "Загрузить",
          to: "/load",
        },
        {
          title: "Настройки",
          to: "/settings",
        }
      ],
      search: "",
    }),
    computed: {
      getUser() {
        return this.$store.getters["user.store/getUser"];
      },
    },
  };
</script>