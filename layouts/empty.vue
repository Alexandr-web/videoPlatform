<template>
  <Nuxt />
</template>

<script>
  export default {
    name: "EmptyLayout",
    middleware: "checkAlreadyAuth",
  };
</script>