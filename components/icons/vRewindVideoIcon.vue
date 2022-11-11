<template>
  <svg
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    :class="classes.filter(Boolean).join(' ')"
  ><path d="M22 36V12L5 24l17 12zm1-12l17 12V12L23 24z" /><path
    d="M0 0h48v48H0z"
    fill="none"
  /></svg>
</template>

<script>
  export default {
    name: "RewindVideoIconComponent",
    props: {
      classes: {
        type: Array,
        default: () => ([]),
      },
    },
  };
</script>