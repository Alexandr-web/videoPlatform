<template>
  <div class="profile__tab profile__tab-settings pb-20 pt-20">
    <vForm
      :classes="['profile__settings-form']"
      :fields="fields"
      :text-button="textButton"
      :pending="pending"
      :res-request="resRequest"
      @sendReq="edit"
      @setMessage="setFormMessage"
    />
  </div>
</template>

<script>
  import handleFormMessagesMixin from "@/mixins/handleFormMessages";
  import vForm from "@/components/vForm";

  export default {
    name: "ProfileSettingsComponent",
    components: { vForm, },
    mixins: [handleFormMessagesMixin],
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
          typeFile: "img",
          isAvatar: true,
          accept: [".jpg", ".jpeg", ".png", ".svg"],
        },
        nickname: {
          title: "Никнейм",
          matchRegexpStr: ".{3,}",
          type: "text",
        },
        email: {
          title: "Электронная почта",
          matchRegexpStr: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
          type: "text",
        },
        password: {
          title: "Пароль",
          matchRegexpStr: ".{6,}",
          type: "password",
        },
      },
      pending: false,
      textButton: "Сохранить",
    }),
    computed: {
      getToken() {
        return this.$store.getters["auth.store/getToken"];
      },
    },
    // Defining a default value depending on the element type of the fields object
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
      /**
       * Submits a profile change request
       * @param {object} data Data that was validated when filling out the form
       */
      edit(data) {
        if (!Object.keys(data).length) {
          this.setFormMessage("Все поля должны быть заполнены правильно", "error");
        } else {
          const token = this.getToken;
          const fd = new FormData();
          const { id: userId, } = this.user;
          
          // Filling formData
          Object.keys(data).map((key) => fd.append(key, data[key]["model" in data[key] ? "model" : "file"]));

          const res = this.$store.dispatch("user.store/edit", { token, fd, id: userId, });

          this.pending = true;
          this.clearFormMessage();

          res.then(({ ok, message, type, }) => {
            this.pending = false;
            this.setFormMessage(message, type);

            if (ok) {
              this.$router.go(0);
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