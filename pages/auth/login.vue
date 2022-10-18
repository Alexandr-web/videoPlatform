<template>
  <div class="auth">
    <div class="container">
      <div class="auth__inner">
        <div class="auth__block">
          <h1 class="auth__title">
            Вход
          </h1>
          <vForm
            :fields="fields"
            :classes="['auth__form']"
            :text-button="textButton"
            :pending="pending"
            @sendReq="login"
          />
          <div class="auth__callout">
            <p class="auth__callout-desc">
              Нет аккаунта? 
              <nuxt-link
                class="auth__callout-link"
                to="/auth/registration"
              >
                Зарегистрироваться
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
    name: "LoginPage",
    components: { vForm, },
    layout: "empty",
    middleware: "checkAlreadyAuth",
    data: () => ({
      fields: {
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
      textButton: "Войти",
    }),
    head: { title: "Вход", },
    methods: {
      login(data) {
        if (Object.keys(this.fields).length !== Object.keys(data).length) {
          this.textButton = "Все поля должны быть заполнены правильно";

          return;
        }

        const fd = Object.keys(data).reduce((acc, key) => {
          acc[key] = data[key].model;
          
          return acc;
        }, {});

        const res = this.$store.dispatch("auth.store/login", fd);

        this.pending = true;

        res.then(({ ok, message, }) => {
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