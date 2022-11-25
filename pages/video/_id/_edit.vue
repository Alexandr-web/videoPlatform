<template>
  <div class="video-edit pt-120 pb-20">
    <div class="container">
      <h1 class="title">Редактирование</h1>
      <div class="video-edit__block">
        <vForm
          :classes="['video-edit__form']"
          :fields="fields"
          text-button="Редактировать"
          :pending="pending"
          :res-request="resRequest"
          :is-video="true"
          @setMessage="setFormMessage"
          @sendReq="edit"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import handleFormMessagesMixin from "@/mixins/handleFormMessages";
  import vForm from "@/components/vForm";

  export default {
    name: "EditVideoPage",
    components: { vForm, },
    mixins: [handleFormMessagesMixin],
    /**
     * We get the video from the server by the id parameter
     * Also determine the author of this video
     */
    validate({ store, params: { id, }, }) {
      const token = store.getters["auth.store/getToken"];
      const currentUser = store.getters["user.store/getUser"];
      const res = store.dispatch("video.store/getOne", { id, token, });

      return res
        .then(({ ok, video, }) => ok && video.userId === currentUser.id)
        .catch((err) => {
          throw err;
        });
    },
    // Getting video by id from the server
    async asyncData({ store, params: { id: videoId, }, }) {
      try {
        const token = store.getters["auth.store/getToken"];
        const { ok, video, } = await store.dispatch("video.store/getOne", { token, id: videoId, });

        if (!ok) {
          return {
            fields: [],
            videoDataIsLoad: true,
          };
        }

        const { poster, src, } = video;
        const validPoster = await store.dispatch("video.store/getValidUrlVideoDataFile", poster);
        const validVideoSrc = await store.dispatch("video.store/getValidUrlVideoDataFile", src);

        // Contains video data from the server
        const videoData = {
          ...video,
          src: validVideoSrc,
          poster: validPoster,
        };
        
        // Contains the data that will be in the edit form
        const videoParams = {
          title: {
            title: "Название",
            matchRegexpStr: ".{6,}",
            type: "text",
            model: "",
          },
          description: {
            title: "Описание",
            matchRegexpStr: ".{12,}",
            type: "text",
            model: "",
          },
          src: {
            type: "file",
            typeFile: "video",
            accept: [".mp4", ".avi", ".mkv"],
            src: "",
          },
          poster: {
            type: "file",
            typeFile: "img",
            accept: [".jpg", ".jpeg", ".png", ".svg"],
            src: "",
          },
        };

        // Writing initial data to a form
        const fields = Object.keys(videoData).reduce((acc, key) => {
          if (key in videoParams) {
            if (["src", "poster"].includes(key)) {
              acc[key].src = videoData[key];
            } else {
              acc[key].model = videoData[key];
            }
          }

          return acc;
        }, { ...videoParams, });

        return { fields, };
      } catch (err) {
        throw err;
      }
    },
    data: () => ({ pending: false, }),
    head: { title: "Редактирование видео", },
    computed: {
      getToken() {
        return this.$store.getters["auth.store/getToken"];
      },
    },
    methods: {
      /**
       * Video data editing
       * @param {object} data Form data to be edited
       */
      async edit(data) {
        if (!Object.keys(data).some((key) => data[key].file || data.model)) {
          this.setFormMessage("Поля должны быть заполнены правильно", "error");
        } else {
          const token = this.getToken;
          const fd = new FormData();
          const { id: videoId, } = this.$route.params;

          // Filling formData
          Object.keys(data).map((key) => fd.append(key, typeof data[key] !== "object" ? data[key] : data[key]["model" in data[key] ? "model" : "file"]));

          const res = this.$store.dispatch("video.store/edit", { id: videoId, token, fd, });

          this.pending = true;
          this.clearFormMessage();

          res.then(({ ok, message, type, }) => {
            this.pending = false;
            this.setFormMessage(message, type);

            if (ok) {
              this.$router.push("/");
            }
          }).catch((err) => {
            this.setFormMessage("Произошла ошибка при отправке запроса", "error");
            
            throw err;
          });
        }
      },
    },
  };
</script>