<template>
  <div
    class="search"
    :class="classes.filter(Boolean).join(' ')"
  >
    <input
      v-model.trim="search"
      class="search__input"
      type="text"
      placeholder="Поиск"
      @input="$emit('writing', search)"
      @keydown.enter="$emit('enter', search)"
      @blur="$emit('writed', search)"
    >
    <button
      class="search__btn"
      @click="$emit('byClick', search)"
    >
      <vSearchIcon :classes="['search__icon']" />
    </button>
  </div>
</template>

<script>
  import vSearchIcon from "@/components/icons/vSearchIcon";

  export default {
    name: "SearchComponent",
    components: { vSearchIcon, },
    props: {
      classes: {
        type: Array,
        default: () => ([]),
      },
    },
    data: () => ({ search: "", }),
  };
</script>