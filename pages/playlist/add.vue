<template>
  <div class="add-playlist pt-120 pb-20">
    <div class="container">
      <h1 class="title">Добавление плейлиста</h1>
      <vForm
        v-if="videos.length"
        :classes="['add-playlist__form']"
        :fields="fields"
        text-button="Создать"
        :pending="pending"
        :res-request="resRequest"
        @setFormMessage="setFormMessage"
        @sendReq="addPlaylist"
      >
        <template v-slot:additionalField>
          <div class="form__field">
            <ul class="videos videos-by-two">
              <vVideoCard
                v-for="(video, index) in videos"
                :key="index"
                :card="video"
                :show-selection="true"
                @chooseCard="chooseCardHandler"
              />
            </ul>
          </div>
        </template>
      </vForm>
      <vNothing
        v-else
        text="Для создания плейлиста нужно иметь хотябы одно видео"
      />
    </div>
  </div>
</template>

<script>
  import vForm from "@/components/vForm";
  import vVideoCard from "@/components/vVideoCard";
  import vNothing from "@/components/vNothing";
  import handleFormMessagesMixin from "@/mixins/handleFormMessages";

  export default {
    name: "AddPlaylistPage",
    components: {
      vForm,
      vNothing,
      vVideoCard,
    },
    mixins: [handleFormMessagesMixin],
    layout: "default",
    // Get all user videos
    async asyncData({ store, }) {
      try {
        const { id: userId, } = store.getters["user.store/getUser"];
        const token = store.getters["auth.store/getToken"];
        const { ok, videos, } = await store.dispatch("user.store/getVideos", { token, id: userId, });

        if (!ok) {
          return { videos: [], };
        }

        const promises = videos.map((video) => {
          const { poster, createdAt, } = video;

          return store.dispatch("video.store/getValidUrlVideoDataFile", poster)
            .then((validPoster) => ({
              ...video,
              checked: false,
              poster: validPoster,
              date: new Date(createdAt).toLocaleDateString(),
            })).catch((err) => {
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
    data: () => ({
      pending: false,
      fields: {
        title: {
          title: "Название",
          matchRegexpStr: "^.{6,36}$",
          type: "text",
        },
        poster: {
          type: "file",
          typeFile: "img",
          accept: [".jpg", ".jpeg", ".png", ".svg"],
        },
      },
    }),
    head: { title: "Добавление плейлиста", },
    computed: {
      getChooseCardsId() {
        return this.videos.filter(({ checked, }) => checked).map(({ id, }) => id);
      },
      getToken() {
        return this.$store.getters["auth.store/getToken"];
      },
    },
    methods: {
      /**
       * Adding a playlist
       * @param {object} data Valid data received from the form
       */
      addPlaylist(data) {
        if (!Object.keys(this.fields).every((key) => data[key]) || !this.getChooseCardsId.length) {
          this.setFormMessage({
            message: "Все поля должны быть заполнены правильно",
            type: "error",
          });

          return;
        }

        const token = this.getToken;
        const fd = new FormData();
        
        // Videos
        fd.append("videos", JSON.stringify(this.getChooseCardsId));

        // Other playlist data
        Object.keys(data).map((key) => {
          fd.append(key, data[key]["file" in data[key] ? "file" : "model"]);
        });

        const res = this.$store.dispatch("playlist.store/add", { token, fd, });

        this.pending = true;

        res
          .then(({ ok, message, type, }) => {
            this.pending = false;
            this.setFormMessage({
              message,
              type,
            });

            if (ok) {
              this.$router.push("/");
            }
          }).catch((err) => {
            this.setFormMessage({
              message: `Произошла ошибка сервера: ${err}`,
              type: "error",
            });
          });
      },
      chooseCardHandler(card) {
        const indexCard = this.videos.findIndex(({ id, }) => id === card.id);

        this.$set(this.videos, indexCard, card);
      },
    },
  };
</script>