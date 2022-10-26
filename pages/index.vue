<template>
  <main class="main pt-120 pb-20">
    <div class="container">
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
    </div>
  </main>
</template>

<script>
  import vVideoCard from "@/components/vVideoCard";
  import getValidUrlDataFileMixin from "@/mixins/getValidUrlDataFile";

  export default {
    name: "MainPage",
    components: { vVideoCard, },
    mixins: [getValidUrlDataFileMixin],
    layout: "default",
    data: () => ({ videos: [], }),
    async fetch() {
      try {
        const { ok, videos, } = await this.$store.dispatch("video.store/getAll");

        if (ok) {
          videos.map((video) => {
            const { poster, } = video;

            this.getValidUrlDataFile(poster).then((validPoster) => {
              this.videos.push({ ...video, poster: validPoster, });
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
