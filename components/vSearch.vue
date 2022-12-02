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
      @keydown.enter="setSearchQuery"
      @blur="setSearchQuery"
    >
    <button
      class="search__btn"
      @click="setSearchQuery"
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
    methods: {
      // Redirecting the user to a new path by adding old parameters
      setSearchQuery() {
        const oldQuery = Object.keys(this.$route.query).reduce((acc, key) => {
          acc[key] = this.$route.query[key];

          return acc;
        }, {});

        this.$router.push({ query: { ...oldQuery, search: this.search, }, });
      },
    },
  };
</script>