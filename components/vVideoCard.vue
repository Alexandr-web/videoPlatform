<template>
  <div class="video-card">
    <nuxt-link
      class="video-card__inner"
      :to="`/video/${card.id}`"
    >
      <div
        class="video-card__picture"
        :class="{ 'skeleton': loadingElement, }"
      >
        <img
          class="video-card__poster"
          :src="card.poster"
          @load="dataElementIsLoaded"
        >
        <div class="video-card__time">{{ card.time }}</div>
      </div>
      <div class="video-card__info">
        <header class="video-card__info-header">
          <div class="video-card__views">
            <vViewsIcon :classes="['video-card__views-icon']" />
            {{ getValidNumberFormat(card.views) }}
          </div>
          <div class="video-card__date">{{ card.date }}</div>
        </header>
        <div class="video-card__info-main">
          <h3 class="video-card__title">{{ card.title }}</h3>
        </div>
      </div>
    </nuxt-link>
    <footer class="video-card__footer">
      <nuxt-link
        class="video-card__link"
        :to="`/user/${card.author.id}?tab=videos`"
      >
        {{ card.author.nickname }}
      </nuxt-link>
    </footer>
  </div>
</template>

<script>
  import vViewsIcon from "@/components/icons/vViewsIcon";
  import getValidNumberFormatMixin from "@/mixins/getValidNumberFormat";
  import loadingElementDataMixin from "@/mixins/loadingElementData";

  export default {
    name: "VideoCardComponent",
    components: { vViewsIcon, },
    mixins: [getValidNumberFormatMixin, loadingElementDataMixin],
    props: {
      card: {
        type: Object,
        required: true,
      },
    },
  };
</script>