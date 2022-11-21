<template>
  <button
    class="follow-btn"
    :class="[...classes, isFollow ? 'follow-btn--disabled' : false].filter(Boolean).join(' ')"
    :disabled="pending"
    @click="$emit('byClick', !isFollow)"
  >{{ isFollow ? "Вы подписаны" : "Подписаться" }}</button>
</template>

<script>
  export default {
    name: "FollowBtnComponent",
    props: {
      classes: {
        type: Array,
        default: () => ([]),
      },
      pending: {
        type: Boolean,
        default: false,
      },
      isFollow: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>