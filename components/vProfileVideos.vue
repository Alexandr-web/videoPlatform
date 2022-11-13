<template>
  <div class="profile__tab profile__tab-videos pb-20 pt-20">
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
    <vNothing v-else />
  </div>
</template>

<script>
  import vVideoCard from "@/components/vVideoCard";
  import vNothing from "@/components/vNothing";
  import getValidUrlVideoDataFileMixin from "@/mixins/getValidUrlVideoDataFile";

  export default {
    name: "ProfileVideosComponent",
    components: {
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
    data: () => ({ videos: [], }),
    async fetch() {
      try {
        const token = this.$store.getters["auth.store/getToken"];
        const { ok, videos, } = await this.$store.dispatch("user.store/getVideos", { token, id: this.user.id, });

        if (ok) {
          videos.map((video) => {
            const { poster, createdAt, } = video;

            // Completing a video with a valid poster
            this.getValidUrlVideoDataFile(poster)
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
      } catch (err) {
        throw err;
      }
    },
  };
</script>