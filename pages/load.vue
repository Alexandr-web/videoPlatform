<template>
  <div class="load-page pt-120 pb-20">
    <div class="container">
      <div class="load-page__block">
        <vForm
          :classes="['load-page__form']"
          :fields="fields"
          :text-button="textButton"
          :pending="pending"
          :is-video="true"
          :res-request="resRequest"
          @sendReq="loadVideo"
          @setError="setError"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import vForm from "@/components/vForm";

  export default {
    name: "LoadVideoPage",
    components: { vForm, },
    layout: "default",
    data: () => ({
      fields: {
        title: {
          title: "Название",
          isMatchRegexp(val) {
            return /.{6,}/g.test(val);
          },
          type: "text",
        },
        description: {
          title: "Описание",
          isMatchRegexp(val) {
            return /.{12,}/g.test(val);
          },
          type: "text",
        },
        video: {
          type: "file",
          isMatchRegexp(val) {
            return val instanceof File;
          },
          typeFile: "video",
          accept: [".mp4", ".avi", ".mkv"],
        },
        poster: {
          type: "file",
          isMatchRegexp(val) {
            return val instanceof File;
          },
          typeFile: "img",
          accept: [".jpg", ".jpeg", ".png", ".svg"],
        },
      },
      textButton: "Загрузить",
      pending: false,
      resRequest: {
        type: "",
        message: "",
      },
    }),
    head: { title: "Загрузка видео", },
    methods: {
      setError(errMessage) {
        this.resRequest = {
          message: errMessage,
          type: "error",
        };
      },
      loadVideo(data) {
        const isContainsRequiredItems = Object.keys(this.fields).every((key) => data[key]);

        if (!isContainsRequiredItems) {
          this.resRequest = {
            message: "Все поля должны быть заполнены правильно",
            type: "error",
          };
        } else {
          const token = this.$store.getters["auth.store/getToken"];
          const fd = new FormData();

          Object.keys(data).map((key) => fd.append(key, typeof data[key] === "object" ? data[key]["file" in data[key] ? "file" : "model"] : data[key]));

          const res = this.$store.dispatch("video.store/load", { fd, token, });

          this.pending = true;
          this.resRequest = {
            message: "",
            type: "",
          };

          res.then(({ message, ok, type, }) => {
            this.pending = false;
            this.resRequest = {
              message,
              type,
            };

            if (ok) {
              this.$router.push("/");
            }
          }).catch((err) => {
            throw err;
          });
        }
      },
    },
  };
</script>