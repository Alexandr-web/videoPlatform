<template>
  <div
    class="videoplayer__rewind-video"
    :class="{
      'videoplayer__rewind-video--show': show,
    }"
    @transitionend="$emit('hide')"
  >
    <div class="videoplayer__rewind-video-center">
      <div class="videoplayer__rewind-video-time">{{ time }}</div>
      <vFastForwardVideoIcon
        v-if="isFastForwardVideo"
        :classes="['videoplayer__rewind-video-icon']"
      />
      <vRewindVideoIcon
        v-if="!isFastForwardVideo"
        :classes="['videoplayer__rewind-video-icon']"
      />
    </div>
  </div>
</template>

<script>
  import vFastForwardVideoIcon from "@/components/icons/vFastForwardVideoIcon";
  import vRewindVideoIcon from "@/components/icons/vRewindVideoIcon";
  
  export default {
    name: "VideoplayerRewindVideoWindowComponent",
    components: {
      vRewindVideoIcon,
      vFastForwardVideoIcon,
    },
    props: {
      isFastForwardVideo: {
        type: Boolean,
        required: true,
      },
      time: {
        type: Number || String,
        required: true,
      },
      show: {
        type: Boolean,
        required: true,
      },
    },
  };
</script>