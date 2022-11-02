<template>
  <div
    class="videoplayer"
    :class="{
      'videoplayer--fullscreen': getFullscreen,
    }"
  >
    <div class="videoplayer__inner">
      <video
        ref="video"
        class="videoplayer__video"
        autoplay
        src="https://cdn.coverr.co/videos/coverr-autumn-lisbon-5773/1080p.mp4"
      ></video>
      <div
        class="videoplayer__controls"
        :class="{
          'videoplayer__controls--fullscreen': getFullscreen,
        }"
      >
        <div class="videoplayer__progress">
          <div class="videoplayer__progress-time">01:04</div>
          <div class="videoplayer__progress-line">
            <div class="videoplayer__progress-slider"></div>
          </div>
          <div class="videoplayer__progress-time">10:00</div>
        </div>
        <div class="videoplayer__controls-block videoplayer__controls-volume">
          <button class="videoplayer__btn">
            <vVolumeIcon :classes="['videoplayer__icon', 'videoplayer__icon-volume']" />
          </button>
          <div class="videoplayer__volume-line">
            <div class="videoplayer__volume-slider"></div>
          </div>
        </div>
        <div class="videoplayer__controls-block videoplayer__controls-state">
          <button class="videoplayer__btn">
            <vPrevIcon :classes="['videoplayer__icon', 'videoplayer__icon-prev']" />
          </button>
          <button class="videoplayer__btn">
            <vPauseIcon
              v-if="getPlay"
              :classes="['videoplayer__icon', 'videoplayer__icon-pause']"
            />
            <vPlayIcon
              v-else
              :classes="['videoplayer__icon', 'videoplayer__icon-play']"
            />
          </button>
          <button class="videoplayer__btn">
            <vNextIcon :classes="['videoplayer__icon', 'videoplayer__icon-next']" />
          </button>
        </div>
        <div class="videoplayer__controls-block videoplayer__controls-screen">
          <button
            class="videoplayer__btn"
            @click="$store.commit('video.store/setFullscreen', !getFullscreen)"
          >
            <vFullScreenIcon :classes="['videoplayer__icon', 'videoplayer__icon-fullscreen']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vPauseIcon from "@/components/icons/vPauseIcon";
  import vPlayIcon from "@/components/icons/vPlayIcon";
  import vVolumeIcon from "@/components/icons/vVolumeIcon";
  import vFullScreenIcon from "@/components/icons/vFullScreenIcon";
  import vPrevIcon from "@/components/icons/vPrevIcon";
  import vNextIcon from "@/components/icons/vNextIcon";

  export default {
    name: "VideoplayerComponent",
    components: {
      vPauseIcon,
      vPlayIcon,
      vVolumeIcon,
      vFullScreenIcon,
      vNextIcon,
      vPrevIcon,
    },
    props: {
      simplyFunctionality: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      getPlay() {
        return this.$store.getters["video.store/getPlay"];
      },
      getFullscreen() {
        return this.$store.getters["video.store/getFullscreen"];
      },
      getVideo() {
        return this.$store.getters["video.store/getVideo"];
      },
    },
    watch: {
      getFullscreen(val) {
        const page = document.documentElement;

        if (val) {
          if (page.requestFullscreen) {
            page.requestFullscreen();
          } else if (page.mozRequestFullScreen) {
            page.mozRequestFullScreen();
          } else if (page.webkitRequestFullscreen) {
            page.webkitRequestFullscreen();
          } else if (page.msRequestFullscreen) {
            page.msRequestFullscreen();
          }
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
      },
    },
  };
</script>