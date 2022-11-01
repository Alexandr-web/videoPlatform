<template>
  <div class="nothing">
    <p class="nothing__text">{{ text }}</p>
  </div>
</template>

<script>
  export default {
    name: "NothingComponent",
    props: {
      text: {
        type: String,
        default: "Ничего нет",
      },
    },
  };
</script>