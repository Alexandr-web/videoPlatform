<template>
  <main class="main pt-120 pb-20">
    <div class="container">
      <h1 class="title">Главная</h1>
      <div class="main__search">
        <vSearch :gaps-bottom="true" />
      </div>
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
  </main>
</template>

<script>
  import vVideoCard from "@/components/vVideoCard";
  import vNothing from "@/components/vNothing";
  import vSearch from "@/components/vSearch";
  import setPlaylistToLocalStorageMixin from "@/mixins/setPlaylistToLocalStorage";

  export default {
    name: "MainPage",
    components: {
      vVideoCard,
      vNothing,
      vSearch,
    },
    mixins: [setPlaylistToLocalStorageMixin],
    layout: "default",
    // Getting all videos from the database
    async asyncData({ store, query: { search, }, }) {
      try {
        const { ok, videos, } = await store.dispatch("video.store/getAll", search || "");

        if (!ok) {
          return { videos: [], };
        }

        const promises = videos.map((video) => {
          const { poster, createdAt, } = video;

          return store.dispatch("video.store/getValidUrlVideoDataFile", poster)
            .then((validPoster) => {
              return {
                ...video,
                poster: validPoster,
                date: new Date(createdAt).toLocaleDateString(),
              };
            }).catch((err) => {
              throw err;
            });
        });

        return Promise.all(promises)
          .then((videosArr) => {
            store.commit("playlist.store/setListVideos", videosArr);

            return { videos: videosArr, };
          }).catch((err) => {
            throw err;
          });
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Главная", },
    // Call the fetch tool when query parameters are updated
    watchQuery: ["search"],
    mounted() {
      if (this.videos) {
        this.setPlaylistToLocalStorage(this.videos);
      }
    },
  };
</script>
