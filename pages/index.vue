<template>
  <main class="main pt-120 pb-20">
    <div class="container">
      <h1 class="title">Главная</h1>
      <ul
        v-if="videos.length"
        class="videos"
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
  import getValidUrlVideoDataFileMixin from "@/mixins/getValidUrlVideoDataFile";

  export default {
    name: "MainPage",
    components: {
      vVideoCard,
      vNothing,
    },
    mixins: [getValidUrlVideoDataFileMixin],
    layout: "default",
    data: () => ({ videos: [], }),
    async fetch() {
      try {
        const { ok, videos, } = await this.$store.dispatch("video.store/getAll");

        if (ok) {
          videos.map((video) => {
            const { poster, createdAt, } = video;

            this.getValidUrlVideoDataFile(poster).then((validPoster) => {
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
    head: { title: "Главная", },
  };
</script>
