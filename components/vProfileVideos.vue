<template>
  <div class="profile__tab profile__tab-videos pb-20 pt-20">
    <header class="profile__tab-header">
      <vSearch :gaps-bottom="true" />
    </header>
    <ul
      v-if="videos.length"
      class="cards"
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
  import vVideoCard from "@/components/vVideoCard";
  import vNothing from "@/components/vNothing";
  import vSearch from "@/components/vSearch";
  import setPlaylistToLocalStorageMixin from "@/mixins/setPlaylistToLocalStorage";

  export default {
    name: "ProfileVideosComponent",
    components: {
      vVideoCard,
      vNothing,
      vSearch,
    },
    mixins: [setPlaylistToLocalStorageMixin],
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data: () => ({ videos: [], }),
    async fetch() {
      try {
        const token = this.getToken;
        const { search, } = this.$route.query;
        const { ok, videos, } = await this.$store.dispatch("user.store/getVideos", {
          token,
          id: this.user.id,
          search: search || "",
        });

        if (ok) {
          this.videos = [];

          videos.map((video) => {
            const { poster, createdAt, } = video;

            // Completing a video with a valid poster
            this.$store.dispatch("video.store/getValidUrlVideoDataFile", poster)
              .then((validPoster) => {
                this.videos.push({
                  ...video,
                  poster: validPoster,
                  date: new Date(createdAt).toLocaleDateString(),
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
    },
    mounted() {
      if (this.videos.length) {
        this.$store.commit("playlist.store/setListVideos", this.videos);
        this.setPlaylistToLocalStorage(this.videos);
      }
    },
  };
</script>