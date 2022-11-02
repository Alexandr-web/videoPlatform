<template>
  <div
    class="loader"
    :class="classes.filter(Boolean).join(' ')"
  ></div>
</template>

<script>
  export default {
    name: "LoaderComponent",
    props: {
      classes: {
        type: Array,
        default: () => ([]),
      },
    },
  };
</script>