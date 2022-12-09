<template>
  <div class="playlist-card">
    <nuxt-link
      class="playlist-card__inner"
      :to="`/playlist/${card.id}`"
    >
      <div
        class="playlist-card__poster"
        :class="{
          'playlist-card__poster-skeleton': loadingElement,
        }"
      >
        <img
          class="playlist-card__poster-img"
          :src="card.poster"
          :alt="card.title"
          @load="dataElementIsLoaded"
        />
      </div>
      <div class="playlist-card__heading">
        <h3 class="playlist-card__heading-item playlist-card__title">{{ card.title }}</h3>
        <h4 class="playlist-card__heading-item playlist-card__subtitle">Всего {{ card.videosId.length }} видео</h4>
        <h4 class="playlist-card__heading-item playlist-card__subtitle">Общее время {{ card.time }}</h4>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
  import loadingElementDataMixin from "@/mixins/loadingElementData";

  export default {
    name: "PlaylistCardComponent",
    mixins: [loadingElementDataMixin],
    props: {
      card: {
        type: Object,
        required: true,
      },
    },
  };
</script>