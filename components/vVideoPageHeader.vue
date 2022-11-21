<template>
  <header class="video-page__info-header">
    <div class="video-page__info-header-block">
      <nuxt-link
        class="video-page__info-user-link"
        :to="`/user/${getVideo.author.id}?tab=videos`"
      >
        <img
          class="video-page__info-user-avatar"
          :src="getVideo.author.avatar"
        >
        <div class="video-page__info-user-nickname">{{ getVideo.author.nickname }}</div>
      </nuxt-link>
    </div>
    <div class="video-page__info-header-block">
      <div class="video-page__info-rate">
        <div class="video-page__info-rate-block">
          <div class="video-page__info-rate-count">{{ getValidNumberFormat(likes) }}</div>
          <button
            class="video-page__info-rate-btn"
            :class="{
              'video-page__info-rate-btn--active': isLike,
            }"
            :disabled="pendingSetRate"
            @click="$emit('setRate', true)"
          >
            <vLikeIcon :class="['video-page__info-rate-icon']" />
          </button>
        </div>
        <div class="video-page__info-rate-block">
          <div class="video-page__info-rate-count">{{ getValidNumberFormat(dislikes) }}</div>
          <button
            class="video-page__info-rate-btn"
            :class="{
              'video-page__info-rate-btn--active': isDislike,
            }"
            :disabled="pendingSetRate"
            @click="$emit('setRate', false)"
          >
            <vDislikeIcon :class="['video-page__info-rate-icon']" />
          </button>
        </div>
      </div>
    </div>
    <div class="video-page__info-header-block video-page__info-header-buttons">
      <vFollowBtn
        v-if="showFollowBtn"
        :pending="pendingFollowing"
        :classes="['video-page__info-header-buttons-btn']"
        :is-follow="follow"
        @byClick="$emit('setFollow', getVideo.author.id)"
      />
      <nuxt-link
        v-if="showEditBtn"
        class="video-page__info-header-buttons-btn edit-btn"
        :to="`/video/${getVideo.id}/edit`"
      >Редактировать</nuxt-link>
    </div>
  </header>
</template>

<script>
  import vLikeIcon from "@/components/icons/vLikeIcon";
  import vDislikeIcon from "@/components/icons/vDislikeIcon";
  import vFollowBtn from "@/components/vFollowBtn";
  import getValidNumberFormatMixin from "@/mixins/getValidNumberFormat";

  export default {
    name: "VideoPageHeaderComponent",
    components: {
      vDislikeIcon,
      vLikeIcon,
      vFollowBtn,
    },
    mixins: [getValidNumberFormatMixin],
    props: {
      pendingSetRate: {
        type: Boolean,
        required: true,
      },
      showFollowBtn: {
        type: Boolean,
        required: true,
      },
      showEditBtn: {
        type: Boolean,
        required: true,
      },
      follow: {
        type: Boolean,
        required: true,
      },
      pendingFollowing: {
        type: Boolean,
        required: true,
      },
      likes: {
        type: Number,
        required: true,
      },
      dislikes: {
        type: Number,
        required: true,
      },
      isLike: {
        type: Boolean,
        required: true,
      },
      isDislike: {
        type: Boolean,
        required: true,
      },
    },
    computed: {
      getVideo() {
        return this.$store.getters["video.store/getVideo"];
      },
    },
  };
</script>