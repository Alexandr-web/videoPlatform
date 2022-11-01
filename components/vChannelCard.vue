<template>
  <div class="channel-card">
    <nuxt-link
      class="channel-card__inner"
      :to="`/user/${channel.id}?tab=videos`"
    >
      <img
        class="channel-card__img"
        :src="channel.avatar"
      />
      <h3 class="channel-card__nickname">{{ channel.nickname }}</h3>
      <div class="channel-card__followers">
        Подписок: 
        {{ getValidNumberFormat(channel.followersId.length) }}
      </div>
    </nuxt-link>
  </div>
</template>

<script>
  import getValidNumberFormatMixin from "@/mixins/getValidNumberFormat";

  export default {
    name: "ChannelCardComponent",
    mixins: [getValidNumberFormatMixin],
    props: {
      channel: {
        type: Object,
        required: true,
      },
    },
  };
</script>