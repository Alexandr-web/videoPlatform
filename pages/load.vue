<template>
  <div class="load-page pt-120 pb-20">
    <div class="container">
      <div class="load-page__block">
        <vForm
          :classes="['load-page__form']"
          :fields="fields"
          :text-button="textButton"
          :pending="pending"
          :get-video-time="true"
          @sendReq="loadVideo"
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
          accept: [".mp4"],
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
    }),
    head: { title: "Загрузка видео", },
    methods: {
      loadVideo(data) {
        const token = this.$store.getters["auth.store/getToken"];
        const fd = new FormData();

        Object.keys(data).map((key) => fd.append(key, typeof data[key] === "object" ? data[key]["file" in data[key] ? "file" : "model"] : data[key]));

        const res = this.$store.dispatch("video.store/load", { fd, token, });

        this.pending = true;

        res.then(({ message, ok, }) => {
          this.pending = false;
          this.textButton = message;

          if (ok) {
            this.$router.push("/");
          }
        }).catch((err) => {
          throw err;
        });
      },
    },
  };
</script>