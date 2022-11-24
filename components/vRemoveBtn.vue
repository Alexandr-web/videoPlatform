<template>
  <button
    class="remove-btn"
    :class="classes.filter(Boolean).join(' ')"
    :disabled="pending"
    @click="$emit('remove')"
  >Удалить</button>
</template>

<script>
  export default {
    name: "RemoveBtnComponent",
    props: {
      classes: {
        type: Array,
        default: () => ([]),
      },
      pending: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>