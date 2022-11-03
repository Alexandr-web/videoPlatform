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
        :poster="getVideo.poster"
        :src="getVideo.src"
        @timeupdate="timeupdateHandler"
        @ended="endedHandler"
        @progress="loading = true"
        @stalled="loading = true"
        @waiting="loading = true"
        @loadedmetadata="loading = false"
        @canplaythrough="loading = false"
        @playing="loading = false"
      ></video>
      <div
        v-if="loading"
        class="videoplayer__wrapper"
      >
        <vLoader />
      </div>
      <div
        class="videoplayer__controls"
        :class="{
          'videoplayer__controls--fullscreen': getFullscreen,
        }"
      >
        <div class="videoplayer__progress">
          <div class="videoplayer__progress-time">{{ getVideo.currentTime }}</div>
          <div
            class="videoplayer__progress-line"
            @click="setDistanceVideoByClick($event)"
          >
            <div
              class="videoplayer__progress-slider"
              :style="{ 'width': `${distanceVideo}%`, }"
            ></div>
          </div>
          <div class="videoplayer__progress-time">{{ getVideo.duration }}</div>
        </div>
        <div class="videoplayer__controls-block videoplayer__controls-volume">
          <button
            class="videoplayer__btn"
            @click="$store.commit('video.store/setMute', !getMute)"
          >
            <vVolumeIcon
              v-if="!getMute"
              :classes="['videoplayer__icon', 'videoplayer__icon-volume']"
            />
            <vMuteVolumeIcon
              v-else
              :classes="['videoplayer__icon', 'videoplayer__icon-mute-volume']"
            />
          </button>
          <div
            class="videoplayer__volume-line"
            @click="setVolumeByClick($event)"
          >
            <div
              class="videoplayer__volume-slider"
              :style="{ 'width': `${(getVolume / 1) * 100}%` }"
            ></div>
          </div>
        </div>
        <div class="videoplayer__controls-block videoplayer__controls-state">
          <button class="videoplayer__btn">
            <vPrevIcon :classes="['videoplayer__icon', 'videoplayer__icon-prev']" />
          </button>
          <button
            class="videoplayer__btn"
            @click="setPlay"
          >
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
  import vMuteVolumeIcon from "@/components/icons/vMuteVolumeIcon";
  import vLoader from "@/components/vLoader";
  import getValidTimeFormatMixin from "@/mixins/getValidTimeFormat";

  export default {
    name: "VideoplayerComponent",
    components: {
      vPauseIcon,
      vPlayIcon,
      vVolumeIcon,
      vFullScreenIcon,
      vNextIcon,
      vPrevIcon,
      vMuteVolumeIcon,
      vLoader,
    },
    mixins: [getValidTimeFormatMixin],
    data: () => ({
      distanceVideo: 0,
      loading: false,
    }),
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
      getMute() {
        return this.$store.getters["video.store/getMute"];
      },
      getVolume() {
        return this.$store.getters["video.store/getVolume"];
      },
      getVideoElement() {
        return this.$refs.video;
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
      getPlay(play) {
        const video = this.getVideoElement;

        if (video) {
          this.loading = true;

          const promise = fetch(video.src)
            .then((res) => res.blob())
            .then(() => {
              this.loading = false;
              video.play();
            });
            
          if (promise !== undefined) {
            promise
              .then(() => {
                this.loading = false;
                video[play ? "play" : "pause"]();
              }).catch((err) => {
                throw err;
              });
          }
        }
      },
      getMute(isMute) {
        this.getVideoElement.muted = isMute;
      },
      getVolume(volume) {
        this.getVideoElement.volume = volume;
        this.$store.commit("video.store/setMute", false);
      },
    },
    beforeDestroy() {
      this.$store.commit("video.store/setPlay", false);
    },
    methods: {
      setPlay() {
        if (!this.loading) {
          this.$store.commit("video.store/setPlay", !this.getPlay);
        }
      },
      endedHandler() {
        this.$store.commit("video.store/setPlay", false);
      },
      setVolumeByClick(e) {
        const widthLine = e.currentTarget.offsetWidth;
        const x = e.layerX;

        if (x >= 0 && x <= widthLine) {
          const percent = Math.ceil((x / widthLine) * 100);
          const volume = (percent * 1) / 100;

          this.$store.commit("video.store/setVolume", volume);
        }
      },
      setDistanceVideoByClick(e) {
        if (!this.loading) {
          const widthLine = e.currentTarget.offsetWidth;
          const x = e.layerX;

          if (x >= 0 && x <= widthLine) {
            const duration = this.getVideoElement.duration;

            this.distanceVideo = Math.ceil((x / widthLine) * 100);
            this.getVideoElement.currentTime = (this.distanceVideo * duration) / 100;
          }
        }
      },
      timeupdateHandler() {
        const { duration, currentTime, } = this.getVideoElement;
        const validDurationTimeFormat = this.getValidTimeFormat(duration - currentTime);
        const validCurrentTimeFormat = this.getValidTimeFormat(currentTime);
        
        this.distanceVideo = Math.ceil((currentTime / duration) * 100);

        this.$store.commit("video.store/setVideo", {
          ...this.getVideo,
          duration: validDurationTimeFormat,
          currentTime: validCurrentTimeFormat,
        });
      },
    },
  };
</script>