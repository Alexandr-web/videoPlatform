<template>
  <div class="video-page pt-120 pb-20">
    <div class="container">
      <div class="video-page__inner">
        <div
          class="video-page__video-block"
          :class="{
            'video-page__video--fullscreen': getFullscreen,
          }"
        >
          <vVideoplayer v-if="getVideo" />
        </div>
        <div class="video-page__info-block"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import vVideoplayer from "@/components/vVideoplayer";
  import getValidUrlDataFileMixin from "@/mixins/getValidUrlDataFile";
  import getValidTimeFormatMixin from "@/mixins/getValidTimeFormat";

  export default {
    name: "VideoPage",
    components: { vVideoplayer, },
    mixins: [getValidUrlDataFileMixin, getValidTimeFormatMixin],
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
    async fetch() {
      try {
        const token = this.$store.getters["auth.store/getToken"];
        const { id, } = this.$route.params;
        const { ok, video, } = await this.$store.dispatch("video.store/getOne", { token, id, });

        await this.$store.dispatch("video.store/setView", { token, videoId: id, });

        if (ok) {
          const { poster: videoPoster, src: srcVideo, } = video;
          const poster = await this.getValidUrlDataFile(videoPoster);
          const src = await this.getValidUrlDataFile(srcVideo);

          this.$store.commit("video.store/setVideo", {
            ...video,
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
    },
  };
</script>