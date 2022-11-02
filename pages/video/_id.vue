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
          <vVideoplayer />
        </div>
        <div class="video-page__info-block"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import vVideoplayer from "@/components/vVideoplayer";

  export default {
    name: "VideoPage",
    components: { vVideoplayer, },
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
    head: { title: "Просмотр видео", },
    computed: {
      getFullscreen() {
        return this.$store.getters["video.store/getFullscreen"];
      },
    },
  };
</script>