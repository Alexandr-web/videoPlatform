<template>
  <div class="video-edit-page pt-100 pb-20">
    <div class="container">
      <vForm
        :fields="fields"
        :text-button="textButton"
        :pending="pendingEdit"
        :res-request="resRequest"
        @setError="setError"
        @sendReq="edit"
      />
    </div>
  </div>
</template>

<script>
  import vForm from "@/components/vForm";
  import getValidUrlVideoDataFile from "@/mixins/getValidUrlVideoDataFile";

  export default {
    name: "EditVideoPage",
    components: { vForm, },
    mixins: [getValidUrlVideoDataFile],
    data: () => ({
      fields: {
        title: {
          title: "Название",
          isMatchRegexp(val) {
            return /.{6,}/g.test(val);
          },
          type: "text",
        },
      },
      resRequest: {
        type: "",
        message: "",
      },
      textButton: "Редактировать",
      pendingEdit: false,
      videoData: {},
    }),
    async fetch() {
      try {
        const token = this.$store.getters["auth.store/getToken"];
        const { id: videoId, } = this.$route.params;
        const { ok, video, } = await this.$store.dispatch("video.store/getOne", { token, id: videoId, });

        if (ok) {
          const { poster, src, } = video;
          const validPoster = await this.getValidUrlVideoDataFile(poster);
          const validVideoSrc = await this.getValidUrlVideoDataFile(src);
          
          this.videoData = {
            ...video,
            video: validVideoSrc,
            poster: validPoster,
          };
        }
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Редактирование видео", },
    methods: {
      edit(data) {
        console.log(data);
      },
      setError(errMessage) {
        this.resRequest = {
          message: errMessage,
          type: "error",
        };
      },
    },
  };
</script>