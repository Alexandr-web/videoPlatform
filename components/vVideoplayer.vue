<template>
  <div
    class="videoplayer"
    :class="{
      'videoplayer--fullscreen': getFullscreen,
    }"
    @mouseleave="hideControls = true"
    @mouseenter="hideControls = false"
    @dblclick="$store.commit('video.store/setFullscreen', !getFullscreen)"
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
        @loadeddata="loading = false"
        @playing="loading = false"
      ></video>
      <vVideoplayerLoaderWindow v-if="loading" />
      <vVideoplayerRewindVideoWindow
        :show="rewindVideo"
        :is-fast-forward-video="isFastForwardVideo"
        :time="rewindTime"
        @hide="rewindVideo = false"
      />
      <div
        class="videoplayer__controls"
        :class="{
          'videoplayer__controls--fullscreen': getFullscreen,
          'videoplayer__controls--hide': hideControls,
        }"
      >
        <div class="videoplayer__progress">
          <div class="videoplayer__progress-time">{{ getVideo.currentTime }}</div>
          <div
            class="videoplayer__progress-line"
            @click="setDistanceVideoByClick($event)"
            @mouseleave="chunkVideo.hide = true"
            @mousemove="switchingVideoChunkPosition($event)"
          >
            <div
              class="videoplayer__progress-slider"
              :style="{ 'width': `${distanceVideo}%`, }"
            ></div>
            <vVideoChunk
              v-if="!chunkVideo.hide"
              :duration="chunkVideo.duration"
              :left="chunkVideo.left"
            />
          </div>
          <div class="videoplayer__progress-time">{{ getVideo.time }}</div>
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
          <button
            class="videoplayer__btn"
            :disabled="getPlaylistVideos.length <= 1"
            @click="switchToNewVideo(true)"
          >
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
          <button
            class="videoplayer__btn"
            :disabled="getPlaylistVideos.length <= 1"
            @click="switchToNewVideo(false)"
          >
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
  import vVideoChunk from "@/components/vVideoChunk";
  import vVideoplayerLoaderWindow from "@/components/vVideoplayerLoaderWindow";
  import vVideoplayerRewindVideoWindow from "@/components/vVideoplayerRewindVideoWindow";
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
      vVideoChunk,
      vVideoplayerLoaderWindow,
      vVideoplayerRewindVideoWindow,
    },
    mixins: [getValidTimeFormatMixin],
    data: () => ({
      loading: false,
      hideControls: false,
      isFastForwardVideo: false,
      rewindVideo: false,
      rewindTime: 3,
      distanceVideo: 0,
      chunkVideo: {
        duration: 0,
        left: 0,
        hide: true,
      },
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
      getToken() {
        return this.$store.getters["auth.store/getToken"];
      },
      getPlaylistVideos() {
        return this.$store.getters["playlist.store/getListVideos"];
      },
      getVideoElement() {
        return this.$refs.video;
      },
    },
    watch: {
      /**
       * Changing the state of full screen mode
       * @param {boolean} val The new value of the fullscreen key
       */
      async getFullscreen(val) {
        const page = document.documentElement;
        
        if (val) {
          if (page.requestFullscreen) {
            await page.requestFullscreen();
          } else if (page.mozRequestFullScreen) {
            page.mozRequestFullScreen();
          } else if (page.webkitRequestFullscreen) {
            page.webkitRequestFullscreen();
          } else if (page.msRequestFullscreen) {
            page.msRequestFullscreen();
          }
        } else if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
      },
      /**
       * Change video state
       * @param {boolean} play The new value of the play key
       */
      getPlay(play) {
        const video = this.getVideoElement;

        this.loading = true;

        if (video) {
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
      /**
       * Changing the video muting state
       * @param {boolean} isMute The new value of the mute key
       */
      getMute(isMute) {
        this.getVideoElement.muted = isMute;
      },
      /**
       * Changes the sound level of the video when the state of the sound in the store changes
       * @param {number} volume The new value of the volume key
       */
      getVolume(volume) {
        this.getVideoElement.volume = volume;
      },
    },
    beforeDestroy() {
      // Turning off the video
      this.$store.commit("video.store/setPlay", false);
      // Set default key behavior
      window.removeEventListener("keydown", this.setHotkeys);
    },
    mounted() {
      window.addEventListener("keydown", this.setHotkeys);

      this.setLocalPlaylist();
    },
    methods: {
      setLocalPlaylist() {
        const localPlaylist = localStorage.getItem("playlistVideos");

        if (localPlaylist) {
          this.$store.commit("playlist.store/setListVideos", JSON.parse(localPlaylist));
        }
      },
      /**
       * Switches videos in a playlist
       * @param {boolean} toPrev Switch to previous video
       */
      switchToNewVideo(toPrev) {
        const { id: currentVideoId, } = this.getVideo;
        const lenPlaylist = this.getPlaylistVideos.length;
        const indexCurrentVideo = this.getPlaylistVideos.findIndex(({ id, }) => id === currentVideoId);

        if (indexCurrentVideo !== -1) {
          if (toPrev) {
            // Set previous video
            const { id: newVideoId, } = this.getPlaylistVideos[indexCurrentVideo <= 0 ? lenPlaylist - 1 : indexCurrentVideo - 1];

            this.$router.push(`/video/${newVideoId}`);
          } else {
            // Set next video
            const { id: newVideoId, } = this.getPlaylistVideos[indexCurrentVideo >= lenPlaylist - 1 ? 0 : indexCurrentVideo + 1];

            this.$router.push(`/video/${newVideoId}`);
          }
        }
      },
      /**
       * Determines the position of the video segment, as well as its time
       * @param {object} e Event object
       */
      switchingVideoChunkPosition(e) {
        const x = e.layerX;

        // Position entry
        this.chunkVideo.left = x;
        this.chunkVideo.hide = false;

        // Recording time
        const widthLine = e.currentTarget.offsetWidth;

        if (x >= 0 && x <= widthLine) {
          const duration = this.getVideoElement.duration;
          const percent = Math.ceil((x / widthLine) * 100);

          this.chunkVideo.duration = (percent * duration) / 100;
        }
      },
      /**
       * Setting hotkeys
       * @param {object} e Event object
       */
      setHotkeys(e) {
        if ([32, 70, 39, 37].includes(e.keyCode)) {
          e.preventDefault();

          switch (e.keyCode) {
            // Space
            case 32:
              this.setPlay();
              break;
            // F key
            case 70:
              if (!this.getFullscreen) {
                this.$store.commit("video.store/setFullscreen", true);
              }
              break;
            // Arrow right
            case 39:
              // Fast forward video 5 seconds
              this.getVideoElement.currentTime += this.rewindTime;
              this.rewindVideo = true;
              this.isFastForwardVideo = true;
              break;
            // Arrow left
            case 37:
              // Rewind video by 5 seconds
              this.getVideoElement.currentTime -= this.rewindTime;
              this.rewindVideo = true;
              this.isFastForwardVideo = false;
              break;
          }
        }
      },
      setPlay() {
        this.$store.commit("video.store/setPlay", !this.getPlay);
      },
      async endedHandler() {
        try {
          const token = this.getToken;
          const { id, } = this.getVideo;

          // Increasing video views
          await this.$store.dispatch("video.store/setView", { token, videoId: id, });

          // Stop video
          this.$store.commit("video.store/setPlay", false);
        } catch (err) {
          throw err;
        }
      },
      /**
       * Setting sound value on click on a line
       * @param {object} e Event object
       */
      setVolumeByClick(e) {
        const widthLine = e.currentTarget.offsetWidth;
        const x = e.layerX;

        if (x >= 0 && x <= widthLine) {
          const percent = Math.ceil((x / widthLine) * 100);
          const volume = (percent * 1) / 100;

          this.$store.commit("video.store/setVolume", volume);
        }
      },
      /**
       * Set the current time of the video by clicking on the line
       * @param {object} e Event object
       */
      setDistanceVideoByClick(e) {
        const widthLine = e.currentTarget.offsetWidth;
        const x = e.layerX;

        if (x >= 0 && x <= widthLine) {
          const duration = this.getVideoElement.duration;

          this.distanceVideo = Math.ceil((x / widthLine) * 100);
          this.getVideoElement.currentTime = (this.distanceVideo * duration) / 100;
        }
      },
      // Changing the current video time
      timeupdateHandler() {
        if (this.getPlay) {
          const { duration, currentTime, } = this.getVideoElement;
          const validDurationTimeFormat = this.getValidTimeFormat(duration - currentTime);
          const validCurrentTimeFormat = this.getValidTimeFormat(currentTime);
          
          this.distanceVideo = Math.ceil((currentTime / duration) * 100);
          this.$store.commit("video.store/setVideo", {
            ...this.getVideo,
            time: validDurationTimeFormat,
            currentTime: validCurrentTimeFormat,
          });
        }
      },
    },
  };
</script>