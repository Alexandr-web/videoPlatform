<template>
  <div class="video-page pt-100 pb-20">
    <div
      v-if="getVideo"
      class="video-page__inner"
    >
      <div
        class="video-page__video-block"
        :class="{
          'video-page__video--fullscreen': getFullscreen,
        }"
      >
        <vVideoplayer />
      </div>
      <div class="video-page__info-block">
        <div class="container">
          <vVideoPageHeader
            :pending-set-rate="pendingSetRate"
            :hide-follow-btn="followingUserIsCurrentUser"
            :follow="follow"
            :pending-following="pendingFollowing"
            :likes="likesCount"
            :dislikes="dislikesCount"
            :is-like="isLike"
            :is-dislike="isDislike"
            @setFollow="setFollow"
            @setRate="setRate"
          />
          <div class="video-page__info-main">
            <h1 class="video-page__info-title">{{ getVideo.title }}</h1>
            <p class="video-page__info-desc">{{ getVideo.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vVideoplayer from "@/components/vVideoplayer";
  import vVideoPageHeader from "@/components/vVideoPageHeader";
  import getValidUrlVideoDataFileMixin from "@/mixins/getValidUrlVideoDataFile";
  import getValidAvatarUrlMixin from "@/mixins/getValidAvatarUrl";
  import getValidTimeFormatMixin from "@/mixins/getValidTimeFormat";
  import setFollowMixin from "@/mixins/setFollow";

  export default {
    name: "VideoPage",
    components: {
      vVideoplayer,
      vVideoPageHeader,
    },
    mixins: [getValidTimeFormatMixin, getValidUrlVideoDataFileMixin, getValidAvatarUrlMixin, setFollowMixin],
    layout: "default",
    validate({ store, params: { id, }, }) {
      const token = store.getters["auth.store/getToken"];
      const res = store.dispatch("video.store/getOne", { token, id, });

      return res
        .then(({ ok, video, }) => [ok, video].every(Boolean))
        .catch((err) => {
          throw err;
        });
    },
    data: () => ({
      pendingSetRate: false,
      followingUserIsCurrentUser: false,
      likesCount: 0,
      dislikesCount: 0,
      isLike: false,
      isDislike: false,
    }),
    // Getting video data
    async fetch() {
      try {
        const token = this.$store.getters["auth.store/getToken"];
        const { id, } = this.$route.params;
        const { ok, video, } = await this.$store.dispatch("video.store/getOne", { token, id, });

        // Increasing video views
        await this.$store.dispatch("video.store/setView", { token, videoId: id, });

        if (ok) {
          const { poster: videoPoster, src: srcVideo, } = video;
          const poster = await this.getValidUrlVideoDataFile(videoPoster);
          const src = await this.getValidUrlVideoDataFile(srcVideo);
          const authorAvatar = await this.getValidAvatarUrl(video.author.avatar);
          const { id: userId, } = this.getUser;

          // Whether the current user is following the author of the video
          this.follow = video.author.followersId.includes(userId);

          // The current user is the user he wants to follow
          this.followingUserIsCurrentUser = video.author.id === userId;

          // Recording the number of positive and negative ratings
          this.likesCount = video.likes.length;
          this.dislikesCount = video.dislikes.length;

          // Record current user rating
          this.isLike = video.likes.includes(userId);
          this.isDislike = video.dislikes.includes(userId);

          this.$store.commit("video.store/setVideo", {
            ...video,
            author: {
              ...video.author,
              avatar: authorAvatar,
            },
            poster,
            src,
            currentTime: this.getValidTimeFormat(0),
            duration: video.duration,
          });
        }
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Просмотр видео", },
    computed: {
      getFullscreen() {
        return this.$store.getters["video.store/getFullscreen"];
      },
      getVideo() {
        return this.$store.getters["video.store/getVideo"];
      },
      getUser() {
        return this.$store.getters["user.store/getUser"];
      },
    },
    methods: {
      /**
       * Rating setting
       * @param {boolean} isLike Liked this video
       */
      setRate(isLike) {
        const token = this.$store.getters["auth.store/getToken"];
        const { id, } = this.$route.params;
        const res = this.$store.dispatch("video.store/setRate", {
          token,
          id,
          isLike,
        });

        this.pendingSetRate = true;

        res.then(({ ok, positiveRating, negativeRating, likes, dislikes, }) => {
          this.pendingSetRate = false;

          if (ok) {
            this.likesCount = likes;
            this.dislikesCount = dislikes;

            this.isLike = positiveRating;
            this.isDislike = negativeRating;
          }
        }).catch((err) => {
          throw err;
        });
      },
    },
  };
</script>