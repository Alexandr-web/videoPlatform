<template>
  <div class="profile__tab profile__tab-settings pb-20 pt-20">
    <vForm
      :classes="['profile__settings-form']"
      :fields="fields"
      :text-button="textButton"
      :pending="pending"
      :res-request="resRequest"
      @sendReq="edit"
      @setError="setError"
    />
  </div>
</template>

<script>
  import vForm from "@/components/vForm";

  export default {
    name: "ProfileSettingsComponent",
    components: { vForm, },
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      fields: {
        avatar: {
          type: "file",
          isMatchRegexp(val) {
            return val instanceof File;
          },
          typeFile: "img",
          isAvatar: true,
          accept: [".jpg", ".jpeg", ".png", ".svg"],
        },
        nickname: {
          title: "Никнейм",
          isMatchRegexp(val) {
            return /.{3,}/g.test(val);
          },
          type: "text",
        },
        email: {
          title: "Электронная почта",
          isMatchRegexp(val) {
            return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(val);
          },
          type: "text",
        },
        password: {
          title: "Пароль",
          isMatchRegexp(val) {
            return /.{6,}/g.test(val);
          },
          type: "password",
        },
      },
      pending: false,
      textButton: "Сохранить",
      resRequest: {
        type: "",
        message: "",
      },
    }),
    created() {
      Object.keys(this.user).map((key) => {
        if (key in this.fields) {
          switch (this.fields[key].type) {
            case "file":
              this.fields[key].src = this.user[key];
              break;
            case "password":
              this.fields[key].model = "";
              break;
            default:
              this.fields[key].model = this.user[key];
          }
        }
      });
    },
    methods: {
      setError(errMessage) {
        this.resRequest = {
          message: errMessage,
          type: "error",
        };
      },
      edit(data) {
        if (!Object.keys(data).length) {
          this.resRequest = {
            type: "error",
            message: "Все поля должны быть заполнены правильно",
          };
        } else {
          const token = this.$store.getters["auth.store/getToken"];
          const fd = new FormData();
          const { id: userId, } = this.user;
          
          Object.keys(data).map((key) => fd.append(key, data[key]["model" in data[key] ? "model" : "file"]));

          const res = this.$store.dispatch("user.store/edit", { token, fd, id: userId, });

          this.pending = true;
          this.resRequest = {
            type: "",
            message: "",
          };

          res.then(({ ok, message, type, }) => {
            this.pending = false;
            this.resRequest = {
              message,
              type,
            };

            if (ok) {
              this.$router.go(0);
            }
          }).catch((err) => {
            throw err;
          });
        }
      },
    },
  };
</script>