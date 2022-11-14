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
          <span class="profile__header-followers-count">{{ getValidNumberFormat(user.followersId.length) }}</span>
        </div>
        <button
          v-if="isGuest"
          :disabled="pendingFollowing"
          class="profile__header-follow-btn follow-btn"
          :class="{
            'follow-btn--disabled': follow,
          }"
          @click="setFollow(followingId)"
        >{{ follow ? "Вы подписаны" : "Подписаться" }}</button>
      </div>
    </div>
  </header>
</template>

<script>
  import setFollowMixin from "@/mixins/setFollow";
  import getValidNumberFormatMixin from "@/mixins/getValidNumberFormat";

  export default {
    name: "ProfileHeaderComponent",
    mixins: [setFollowMixin, getValidNumberFormatMixin],
    props: {
      user: {
        type: Object,
        required: true,
      },
      isGuest: {
        type: Boolean,
        required: true,
      },
      followingId: {
        type: Number,
        required: true,
      },
      isFollow: {
        type: Boolean,
        required: true,
      },
    },
    created() {
      this.follow = this.isFollow;
    },
  };
</script>