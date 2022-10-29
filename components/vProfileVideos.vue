<template>
  <div class="profile__tab profile__tab-videos">
    <ul
      v-if="videos.length"
      class="profile__videos"
    >
      <vVideoCard
        v-for="(video, index) in videos"
        :key="index"
        :card="video"
      />
    </ul>
  </div>
</template>

<script>
  import vVideoCard from "@/components/vVideoCard";
  import getValidUrlDataFileMixin from "@/mixins/getValidUrlDataFile";

  export default {
    name: "ProfileVideosComponent",
    components: { vVideoCard, },
    mixins: [getValidUrlDataFileMixin],
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data: () => ({ videos: [], }),
    async mounted() {
      const token = this.$store.getters["auth.store/getToken"];
      const { ok, videos, } = await this.$store.dispatch("user.store/getVideos", { token, id: this.user.id, });

      if (ok) {
        videos.map((video) => {
          const { poster, createdAt, } = video;

          this.getValidUrlDataFile(poster)
            .then((validPoster) => {
              const { id, nickname, } = this.user;

              this.videos.push({
                ...video,
                poster: validPoster,
                date: new Date(createdAt).toLocaleDateString(),
                author: {
                  id,
                  nickname,
                },
              });
            }).catch((err) => {
              throw err;
            });
        });
      }
    },
  };
</script>