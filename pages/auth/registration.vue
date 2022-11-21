<template>
  <div class="auth">
    <div class="container">
      <div class="auth__inner">
        <div class="auth__block">
          <h1 class="auth__title">
            Регистрация
          </h1>
          <vForm
            :fields="fields"
            :classes="['auth__form']"
            :text-button="textButton"
            :pending="pending"
            :res-request="resRequest"
            @sendReq="registration"
            @setMessage="setFormMessage"
          />
          <div class="auth__callout">
            <p class="auth__callout-desc">
              Есть аккаунт?
              <nuxt-link
                class="auth__callout-link"
                to="/auth/login"
              >
                Войти
              </nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import handleFormMessagesMixin from "@/mixins/handleFormMessages";
  import vForm from "@/components/vForm";

  export default {
    name: "RegistrationPage",
    components: { vForm, },
    mixins: [handleFormMessagesMixin],
    layout: "empty",
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
      textButton: "Зарегистрироваться",
    }),
    head: { title: "Регистрация", },
    methods: {
      registration(data) {
        const isContainsRequiredItems = Object.keys(this.fields).every((key) => key in data);

        if (!isContainsRequiredItems) {
          this.setFormMessage("Все поля должны быть заполнены правильно", "error");
        } else {
          const fd = new FormData();

          Object.keys(data).map((key) => fd.append(key, data[key]["file" in data[key] ? "file" : "model"]));

          const res = this.$store.dispatch("auth.store/registration", fd);

          this.pending = true;
          this.clearFormMessage();

          res.then(({ ok, message, type, }) => {
            this.pending = false;
            this.setFormMessage(message, type);

            if (ok) {
              this.$router.push("/auth/login");
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