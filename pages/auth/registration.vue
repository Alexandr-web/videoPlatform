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
  import vForm from "@/components/vForm";

  export default {
    name: "RegistrationPage",
    components: { vForm, },
    layout: "empty",
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
      textButton: "Зарегистрироваться",
      resRequest: {
        type: "",
        message: "",
      },
    }),
    head: { title: "Регистрация", },
    methods: {
      registration(data) {
        const isContainsRequiredItems = Object.keys(this.fields).every((key) => key in data);

        if (!isContainsRequiredItems) {
          this.resRequest = {
            message: "Все поля должны быть заполнены правильно",
            type: "error",
          };
        } else {
          const fd = new FormData();

          Object.keys(data).map((key) => fd.append(key, data[key]["file" in data[key] ? "file" : "model"]));

          const res = this.$store.dispatch("auth.store/registration", fd);

          this.pending = true;
          this.resRequest = {
            message: "",
            type: "",
          };

          res.then(({ ok, message, type, }) => {
            this.pending = false;
            this.resRequest = {
              message,
              type,
            };

            if (ok) {
              this.$router.push("/auth/login");
            }
          }).catch((err) => {
            throw err;
          });
        }
      },
    },
  };
</script>