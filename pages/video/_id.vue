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
            :rate="rate"
            :pending-set-rate="pendingSetRate"
            :hide-follow-btn="followingUserIsCurrentUser"
            :follow="follow"
            :pending-following="pendingFollowing"
            @setFollow="setFollow"
            @setRate="setRate"
          />
          <div class="video-page__info-main">
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
  import getValidUrlDataFileMixin from "@/mixins/getValidUrlDataFile";
  import getValidAvatarUrlMixin from "@/mixins/getValidAvatarUrl";
  import getValidTimeFormatMixin from "@/mixins/getValidTimeFormat";
  import setFollowMixin from "@/mixins/setFollow";

  export default {
    name: "VideoPage",
    components: {
      vVideoplayer,
      vVideoPageHeader,
    },
    mixins: [getValidTimeFormatMixin, getValidUrlDataFileMixin, getValidAvatarUrlMixin, setFollowMixin],
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
      rate: {
        complete: false,
        isLike: false,
      },
      followingUserIsCurrentUser: false,
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
          const poster = await this.getValidUrlDataFile(videoPoster);
          const src = await this.getValidUrlDataFile(srcVideo);
          const authorAvatar = await this.getValidAvatarUrl(video.author.avatar);

          // Whether the current user is following the author of the video
          this.follow = video.author.followersId.includes(this.getUser.id);

          // The current user is the user he wants to follow
          this.followingUserIsCurrentUser = video.author.id === this.getUser.id;

          this.$store.commit("video.store/setVideo", {
            ...video,
            author: {
              ...video.author,
              avatar: authorAvatar,
            },
            poster,
            src,
            currentTime: this.getValidTimeFormat(0),
            duration: this.getValidTimeFormat(video.duration),
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
        console.log(isLike);
      },
    },
  };
</script>