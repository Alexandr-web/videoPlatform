<template>
  <div class="videoplayer__loading">
    <vLoader />
  </div>
</template>

<script>
  import vLoader from "@/components/vLoader";

  export default {
    name: "VideoplayerLoaderWindowComponent",
    components: { vLoader, },
  };
</script>