<template>
  <div class="channel-card">
    <nuxt-link
      class="channel-card__inner"
      :to="`/user/${channel.id}?tab=videos`"
    >
      <div
        class="channel-card__avatar"
        :class="{
          'channel-card__avatar-skeleton': loadingAvatar,
        }"
      >
        <img
          class="channel-card__avatar-img"
          :src="channel.avatar"
          @load="setLoadingAvatar(false)"
        />
      </div>
      <h3 class="channel-card__nickname">{{ channel.nickname }}</h3>
      <div class="channel-card__followers">Подписчиков: {{ getValidNumberFormat(channel.followersId.length) }}</div>
    </nuxt-link>
  </div>
</template>

<script>
  import getValidNumberFormatMixin from "@/mixins/getValidNumberFormat";
  import loadingAvatarMixin from "@/mixins/loadingAvatar";

  export default {
    name: "ChannelCardComponent",
    mixins: [getValidNumberFormatMixin, loadingAvatarMixin],
    props: {
      channel: {
        type: Object,
        required: true,
      },
    },
  };
</script>