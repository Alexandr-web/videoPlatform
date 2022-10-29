<template>
  <header class="profile__header">
    <div class="container">
      <div class="profile__header-inner">
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
    },
    computed: {
      getNavListForGuest() {
        return this.navList.filter(({ onlyOwner, }) => !onlyOwner);
      },
    },
  };
</script>