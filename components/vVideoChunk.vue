<template>
  <div
    ref="videoChunk"
    class="videoplayer__video-chunk"
    :style="{
      'left': `${leftPos}px`,
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
    data: () => ({ leftPos: 0, }),
    computed: {
      getVideoChunkElement() {
        return this.$refs.videoChunk;
      },
    },
    watch: {
      left(val) {
        this.setValidLeftPosition(val);
      },
    },
    mounted() {
      this.setValidLeftPosition(this.left);
    },
    methods: {
      /**
       * Sets the left position, makes the cursor be in the middle of the video segment
       * @param {number} val Left position value
       */
      setValidLeftPosition(val) {
        const { offsetWidth, } = this.getVideoChunkElement;

        this.leftPos = val - offsetWidth - offsetWidth / 2;
      },
    },
  };
</script>