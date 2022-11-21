<template>
  <div class="video-edit pt-120 pb-20">
    <div class="container">
      <h1 class="title">Редактирование</h1>
      <div class="video-edit__block">
        <vForm
          :classes="['video-edit__form']"
          :fields="fields"
          :text-button="textButton"
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
  import getValidUrlVideoDataFileMixin from "@/mixins/getValidUrlVideoDataFile";
  import vForm from "@/components/vForm";

  export default {
    name: "EditVideoPage",
    components: { vForm, },
    mixins: [getValidUrlVideoDataFileMixin, handleFormMessagesMixin],
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
    data: () => ({
      fields: {
        title: {
          title: "Название",
          matchRegexpStr: ".{6,}",
          type: "text",
        },
        description: {
          title: "Описание",
          matchRegexpStr: ".{12,}",
          type: "text",
        },
        src: {
          type: "file",
          typeFile: "video",
          accept: [".mp4", ".avi", ".mkv"],
        },
        poster: {
          type: "file",
          typeFile: "img",
          accept: [".jpg", ".jpeg", ".png", ".svg"],
        },
      },
      textButton: "Редактировать",
      pending: false,
    }),
    // Getting video by id from the server
    async fetch() {
      try {
        const token = this.$store.getters["auth.store/getToken"];
        const { id: videoId, } = this.$route.params;
        const { ok, video, } = await this.$store.dispatch("video.store/getOne", { token, id: videoId, });

        if (ok) {
          const { poster, src, } = video;
          const validPoster = await this.getValidUrlVideoDataFile(poster);
          const validVideoSrc = await this.getValidUrlVideoDataFile(src);
          const videoData = {
            ...video,
            src: validVideoSrc,
            poster: validPoster,
          };

          // Writing initial data to a form
          Object.keys(videoData).map((key) => {
            if (key in this.fields) {
              if (["src", "poster"].includes(key)) {
                this.fields[key].src = videoData[key];
              } else {
                this.fields[key].model = videoData[key];
              }
            }
          });
        }
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Редактирование видео", },
    methods: {
      /**
       * Video data editing
       * @param {object} data Form data to be edited
       */
      async edit(data) {
        if (!Object.keys(data).some((key) => data[key].file || data.model)) {
          this.setFormMessage("Поля должны быть заполнены правильно", "error");
        } else {
          const token = this.$store.getters["auth.store/getToken"];
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