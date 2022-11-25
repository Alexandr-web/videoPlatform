<template>
  <header class="profile__header">
    <div class="container">
      <div class="profile__header-inner">
        <div class="profile__header-background"></div>
        <div
          class="profile__header-avatar"
          :class="{
            'profile__header-avatar-skeleton': loadingAvatar,
          }"
        >
          <img
            class="profile__header-avatar-image"
            :src="user.avatar"
            @load="setLoadingAvatar(false)"
          >
        </div>
        <div class="profile__header-nickname">
          {{ user.nickname }}
          <span class="profile__header-followers-count">{{ getValidNumberFormat(user.followersId.length) }}</span>
        </div>
        <vFollowBtn
          v-if="isGuest"
          :classes="['profile__header-follow-btn']"
          :is-follow="follow"
          :pending="pendingFollowing"
          @byClick="setFollow(followingId)"
        />
      </div>
    </div>
  </header>
</template>

<script>
  import vFollowBtn from "@/components/vFollowBtn";
  import setFollowMixin from "@/mixins/setFollow";
  import getValidNumberFormatMixin from "@/mixins/getValidNumberFormat";
  import loadingAvatarMixin from "@/mixins/loadingAvatar";

  export default {
    name: "ProfileHeaderComponent",
    components: { vFollowBtn, },
    mixins: [setFollowMixin, getValidNumberFormatMixin, loadingAvatarMixin],
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