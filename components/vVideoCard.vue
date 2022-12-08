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
      <div
        v-if="showSelection"
        class="video-card__selection"
      >
        <label
          class="checkbox"
          :for="`checkbox-${card.id}`"
          :title="card.checked ? 'Исключить из плейлиста' : 'Включить в плейлист'"
        >
          <input
            :id="`checkbox-${card.id}`"
            class="checkbox__input"
            type="checkbox"
            :checked="card.checked"
            @change="$emit('chooseCard', { ...card, checked: !card.checked, })"
          >
          <div class="checkbox__style"></div>
        </label>
      </div>
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
      showSelection: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>