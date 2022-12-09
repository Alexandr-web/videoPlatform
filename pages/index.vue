<template>
  <main class="main pt-120 pb-20">
    <div class="container">
      <h1 class="title">Главная</h1>
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

  export default {
    name: "MainPage",
    components: {
      vVideoCard,
      vNothing,
    },
    layout: "default",
    // Getting all videos from the database
    async asyncData({ store, }) {
      try {
        const { ok, videos, } = await store.dispatch("video.store/getAll");

        if (!ok) {
          return { videos: [], };
        }

        // Contains promises where videos with valid data
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
          .then((videosArr) => ({ videos: videosArr, }))
          .catch((err) => {
            throw err;
          });
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Главная", },
  };
</script>
