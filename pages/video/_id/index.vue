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
            :author-is-current-user="authorIsCurrentUser"
            :follow="follow"
            :likes="likesCount"
            :dislikes="dislikesCount"
            :is-like="isLike"
            :is-dislike="isDislike"
            :pending-set-rate="pendingSetRate"
            :pending-following="pendingFollowing"
            :pending-remove="pendingRemove"
            @setFollow="setFollow"
            @setRate="setRate"
            @removeVideo="removeVideo"
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
  import getValidTimeFormatMixin from "@/mixins/getValidTimeFormat";
  import setFollowMixin from "@/mixins/setFollow";

  export default {
    name: "VideoPage",
    components: {
      vVideoplayer,
      vVideoPageHeader,
    },
    mixins: [getValidTimeFormatMixin, setFollowMixin],
    layout: "default",
    // Checking if the video exists in the database
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
      pendingRemove: false,
      authorIsCurrentUser: false,
      likesCount: 0,
      dislikesCount: 0,
      isLike: false,
      isDislike: false,
    }),
    // Getting video data
    async fetch() {
      try {
        const token = this.getToken;
        const { id, } = this.$route.params;
        const { ok, video, } = await this.$store.dispatch("video.store/getOne", { token, id, });

        if (ok) {
          const { poster: videoPoster, src: srcVideo, } = video;
          const poster = await this.$store.dispatch("video.store/getValidUrlVideoDataFile", videoPoster);
          const src = await this.$store.dispatch("video.store/getValidUrlVideoDataFile", srcVideo);
          const authorAvatar = await this.$store.dispatch("user.store/getValidAvatarUrl", video.author.avatar);
          const { id: userId, } = this.getUser;

          // Whether the current user is following the author of the video
          this.follow = video.author.followersId.includes(userId);

          // The current user is the user he wants to follow
          this.authorIsCurrentUser = video.author.id === userId;

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
      getToken() {
        return this.$store.getters["auth.store/getToken"];
      },
    },
    methods: {
      /**
       * Rating setting
       * @param {boolean} isLike Liked this video
       */
      setRate(isLike) {
        const token = this.getToken;
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
      /**
       * Delete video by its id
       * @param {number} videoId Video id
       */
      removeVideo(videoId) {
        const token = this.getToken;
        const res = this.$store.dispatch("video.store/remove", { token, id: videoId, });

        this.pendingRemove = true;

        res.then(({ ok, }) => {
          this.pendingRemove = false;
          
          if (ok) {
            this.$router.push("/");
          }
        }).catch((err) => {
          throw err;
        });
      },
    },
  };
</script>