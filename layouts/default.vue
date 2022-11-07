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
    // Set local volume and local mute
    mounted() {
      const localVolume = localStorage.getItem("volume");
      const localMute = localStorage.getItem("mute");
      
      // For volume
      this.setLocalData(localVolume, {
        place: "video.store/setVolume",
        data: +localVolume,
        name: "volume",
        default: 0.5,
      });
      
      // For mute
      this.setLocalData(localMute, {
        place: "video.store/setMute",
        data: JSON.parse(localMute),
        name: "mute",
        default: false,
      });
    },
    methods: {
      setLocalData(localData, toSetData) {
        if (localData) {
          this.$store.commit(toSetData.place, toSetData.data);
        } else {
          localStorage.setItem(toSetData.name, toSetData.default);
          this.$store.commit(toSetData.place, toSetData.default);
        }
      },
    },
  };
</script>