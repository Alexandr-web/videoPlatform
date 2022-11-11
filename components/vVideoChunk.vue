<template>
  <div
    ref="videoChunk"
    class="videoplayer__video-chunk"
    :style="{
      'transform': `translate(${pos.left}px, -${pos.top}px)`,
    }"
  >
    <div class="videoplayer__video-chunk-time">{{ getValidTimeFormat(duration) }}</div>
  </div>
</template>

<script>
  import getValidTimeFormatMixin from "@/mixins/getValidTimeFormat";

  export default {
    name: "VideoChunkComponent",
    mixins: [getValidTimeFormatMixin],
    props: {
      duration: {
        type: Number,
        required: true,
      },
      left: {
        type: Number,
        required: true,
      },
    },
    data: () => ({
      pos: {
        left: 0,
        top: 0,
      },
    }),
    computed: {
      getVideoChunkElement() {
        return this.$refs.videoChunk;
      },
    },
    watch: {
      // Aligning a block to the center
      left(val) {
        const { offsetWidth, } = this.getVideoChunkElement;

        this.pos = {
          ...this.pos,
          left: val - offsetWidth / 2,
        };
      },
    },
    // Position setting
    mounted() {
      const { offsetHeight, } = this.getVideoChunkElement;

      this.pos = {
        top: offsetHeight,
        left: this.left,
      };
    },
  };
</script>