<template>
  <div class="default-layout">
    <vHeader />
    <Nuxt />
  </div>
</template>

<script>
  import vHeader from "@/components/vHeader";

  export default {
    name: "DefaultLayout",
    components: { vHeader, },
    middleware: "checkAuth",
  };
</script>