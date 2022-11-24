<template>
  <div class="profile__tab profile__tab-history pb-20 pt-20">
    <header class="profile__history-header">
      <div class="profile__history-header-block profile__history-header-search">
        <vSearch
          @enter="setSearchQuery"
          @byClick="setSearchQuery"
        />
      </div>
      <div class="profile__history-header-block profile__history-header-filters">
        <label
          class="profile__history-filter"
          for="videos-filter"
        >
          <input
            id="videos-filter"
            v-model="filter.myVideos"
            class="profile__history-filter-input"
            type="checkbox"
          >
          <div class="profile__history-filter-btn">
            Показать мои видео
            <div
              class="profile__history-filter-checkbox"
              :class="{
                'profile__history-filter-checkbox--active': filter.myVideos
              }"
            ></div>
          </div>
        </label>
      </div>
    </header>
    <ul
      v-if="videos.length"
      class="profile__history-videos"
    >
      <vVideoCard
        v-for="(video, index) in videos"
        :key="index"
        :card="video"
      />
    </ul>
    <vNothing v-else />
  </div>
</template>

<script>
  import vSearch from "@/components/vSearch";
  import vVideoCard from "@/components/vVideoCard";
  import vNothing from "@/components/vNothing";
  import getValidUrlVideoDataFileMixin from "@/mixins/getValidUrlVideoDataFile";

  export default {
    name: "ProfileHistoryComponent",
    components: {
      vSearch,
      vVideoCard,
      vNothing,
    },
    mixins: [getValidUrlVideoDataFileMixin],
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      filter: { myVideos: true, },
      videos: [],
    }),
    // Getting viewed videos
    async fetch() {
      try {
        const token = this.getToken;
        const { myVideos = this.filter.myVideos, search = "", } = this.$route.query;
        const { id, } = this.$store.getters["user.store/getUser"];
        const { ok, videos, } = await this.$store.dispatch("user.store/getHistory", {
          token,
          id,
          search: search || "",
          myVideos: JSON.parse(myVideos),
        });

        // Give initial value to filter if query parameter exists
        this.filter.myVideos = JSON.parse(myVideos);

        if (ok) {
          this.videos = [];

          videos.map((video) => {
            const posterRes = this.getValidUrlVideoDataFile(video.poster);
            const videoRes = this.getValidUrlVideoDataFile(video.src);

            Promise.all([posterRes, videoRes])
              .then(([poster, src]) => {
                this.videos.push({
                  ...video,
                  poster,
                  src,
                });
              }).catch((err) => {
                throw err;
              });
          });
        }
      } catch (err) {
        throw err;
      }
    },
    computed: {
      getToken() {
        return this.$store.getters["auth.store/getToken"];
      },
    },
    watch: {
      // Call the fetch tool when query parameters are updated
      "$route.query": "$fetch",
      /**
       * Redirecting the user to a new path by adding the old parameters
       * @param {string} val New value of query myVideos
       */
      "filter.myVideos": function (val) {
        const oldQuery = Object.keys(this.$route.query).reduce((acc, key) => {
          acc[key] = this.$route.query[key];

          return acc;
        }, {});

        this.$router.push({ query: { ...oldQuery, myVideos: val, }, });
      },
    },
    methods: {
      /**
       * Redirecting the user to a new path by adding old parameters
       * @param {string} val The value of the query parameter search
       */
      setSearchQuery(val) {
        const oldQuery = Object.keys(this.$route.query).reduce((acc, key) => {
          acc[key] = this.$route.query[key];

          return acc;
        }, {});

        this.$router.push({ query: { ...oldQuery, search: val, }, });
      },
    },
  };
</script>