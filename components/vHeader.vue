<template>
  <header class="header">
    <div class="container">
      <nav class="header__nav">
        <div class="header__block header__search">
          <vSearch />
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
            <li class="header__menu-item">
              <nuxt-link
                class="header__menu-link"
                exact-active-class="header__menu-link--active"
                :to="`/user/${getUser.id}?tab=channels`"
              >Каналы</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="header__block header__user">
          <nuxt-link
            class="header__user-avatar"
            :to="`/user/${getUser.id}?tab=videos`"
            :class="{ 'header__user-avatar-skeleton': loadingAvatar, }"
          >
            <img
              class="header__user-avatar-image"
              :src="getUser.avatar"
              :alt="getUser.nickname"
              @load="setLoadingAvatar(false)"
            >
          </nuxt-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
  import vSearch from "@/components/vSearch";
  import loadingAvatarMixin from "@/mixins/loadingAvatar";

  export default {
    name: "HeaderComponent",
    components: { vSearch, },
    mixins: [loadingAvatarMixin],
    data: () => ({
      menu: [
        {
          title: "Главная",
          to: "/",
        },
        {
          title: "Загрузить",
          to: "/load",
          id: "load",
        }
      ],
    }),
    computed: {
      getUser() {
        return this.$store.getters["user.store/getUser"];
      },
    },
  };
</script>