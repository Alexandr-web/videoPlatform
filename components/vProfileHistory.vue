<template>
  <div class="profile__tab profile__tab-history pb-20 pt-20">
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
  import vSearch from "@/components/vSearch";
  import vVideoCard from "@/components/vVideoCard";
  import vNothing from "@/components/vNothing";
  import setPlaylistToLocalStorageMixin from "@/mixins/setPlaylistToLocalStorage";

  export default {
    name: "ProfileHistoryComponent",
    components: {
      vSearch,
      vVideoCard,
      vNothing,
    },
    mixins: [setPlaylistToLocalStorageMixin],
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data: () => ({ videos: [], }),
    // Getting viewed videos
    async fetch() {
      try {
        const token = this.getToken;
        const { search, } = this.$route.query;
        const { id, } = this.user;
        const { ok, videos, } = await this.$store.dispatch("user.store/getHistory", {
          token,
          id,
          search: search || "",
        });
        
        if (ok) {
          this.videos = [];

          videos.map((video) => {
            const { poster, createdAt, } = video;
            const posterRes = this.$store.dispatch("video.store/getValidUrlVideoDataFile", poster);

            posterRes.then((validPoster) => {
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