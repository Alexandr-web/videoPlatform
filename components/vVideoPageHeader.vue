<template>
  <header class="video-page__info-header">
    <div class="video-page__info-header-block">
      <nuxt-link
        class="video-page__info-user-link"
        :to="`/user/${getVideo.author.id}?tab=videos`"
      >
        <div
          class="video-page__info-user-avatar"
          :class="{
            'video-page__info-user-link-skeleton': loadingElement,
          }"
        >
          <img
            class="video-page__info-user-avatar-img"
            :src="getVideo.author.avatar"
            @load="dataElementIsLoaded"
          >
        </div>
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
        v-if="!authorIsCurrentUser"
        :pending="pendingFollowing"
        :classes="['video-page__info-header-buttons-btn']"
        :is-follow="follow"
        @byClick="$emit('setFollow', getVideo.author.id)"
      />
      <nuxt-link
        v-if="authorIsCurrentUser"
        class="video-page__info-header-buttons-btn edit-btn"
        :to="`/video/${getVideo.id}/edit`"
      >Редактировать</nuxt-link>
      <vRemoveBtn
        v-if="authorIsCurrentUser"
        :classes="['video-page__info-header-buttons-btn']"
        :pending="pendingRemove"
        @remove="$emit('removeVideo', getVideo.id)"
      />
    </div>
  </header>
</template>

<script>
  import vLikeIcon from "@/components/icons/vLikeIcon";
  import vDislikeIcon from "@/components/icons/vDislikeIcon";
  import vFollowBtn from "@/components/vFollowBtn";
  import vRemoveBtn from "@/components/vRemoveBtn";
  import getValidNumberFormatMixin from "@/mixins/getValidNumberFormat";
  import loadingElementDataMixin from "@/mixins/loadingElementData";

  export default {
    name: "VideoPageHeaderComponent",
    components: {
      vDislikeIcon,
      vLikeIcon,
      vFollowBtn,
      vRemoveBtn,
    },
    mixins: [getValidNumberFormatMixin, loadingElementDataMixin],
    props: {
      pendingSetRate: {
        type: Boolean,
        required: true,
      },
      pendingFollowing: {
        type: Boolean,
        required: true,
      },
      pendingRemove: {
        type: Boolean,
        required: true,
      },
      authorIsCurrentUser: {
        type: Boolean,
        required: true,
      },
      follow: {
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