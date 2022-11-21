<template>
  <div class="load-page pt-120 pb-20">
    <div class="container">
      <h1 class="title">Загрузка видео</h1>
      <div class="load-page__block">
        <vForm
          :classes="['load-page__form']"
          :fields="fields"
          :text-button="textButton"
          :pending="pending"
          :is-video="true"
          :res-request="resRequest"
          @sendReq="loadVideo"
          @setMessage="setFormMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import handleFormMessagesMixin from "@/mixins/handleFormMessages";
  import vForm from "@/components/vForm";

  export default {
    name: "LoadVideoPage",
    components: { vForm, },
    mixins: [handleFormMessagesMixin],
    layout: "default",
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
        video: {
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
      textButton: "Загрузить",
      pending: false,
    }),
    head: { title: "Загрузка видео", },
    methods: {
      loadVideo(data) {
        const isContainsRequiredItems = Object.keys(this.fields).every((key) => data[key]);

        if (!isContainsRequiredItems) {
          this.setFormMessage("Все поля должны быть заполнены правильно", "error");
        } else {
          const token = this.$store.getters["auth.store/getToken"];
          const fd = new FormData();

          Object.keys(data).map((key) => fd.append(key, typeof data[key] === "object" ? data[key]["file" in data[key] ? "file" : "model"] : data[key]));

          const res = this.$store.dispatch("video.store/load", { fd, token, });

          this.pending = true;
          this.clearFormMessage();

          res.then(({ message, ok, type, }) => {
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