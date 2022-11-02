<template>
  <div class="default-layout">
    <vHeader v-if="!getFullscreen" />
    <Nuxt />
  </div>
</template>

<script>
  import vHeader from "@/components/vHeader";

  export default {
    name: "DefaultLayout",
    components: { vHeader, },
    middleware: "checkAuth",
    computed: {
      getFullscreen() {
        return this.$store.getters["video.store/getFullscreen"];
      },
    },
  };
</script>