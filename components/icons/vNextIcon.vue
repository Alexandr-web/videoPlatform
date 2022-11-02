<template>
  <svg
    :class="classes.filter(Boolean).join(' ')"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  ><path d="M12 36l17-12-17-12v24zm20-24v24h4V12h-4z" /><path
    d="M0 0h48v48H0z"
    fill="none"
  /></svg>
</template>

<script>
  export default {
    name: "NextIconComponent",
    props: {
      classes: {
        type: Array,
        default: () => ([]),
      },
    },
  };
</script>