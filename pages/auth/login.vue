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
            :res-request="resRequest"
            @sendReq="login"
            @setMessage="setFormMessage"
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
  import handleFormMessagesMixin from "@/mixins/handleFormMessages";
  import vForm from "@/components/vForm";

  export default {
    name: "LoginPage",
    components: { vForm, },
    mixins: [handleFormMessagesMixin],
    layout: "empty",
    data: () => ({
      fields: {
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
      textButton: "Войти",
    }),
    head: { title: "Вход", },
    methods: {
      login(data) {
        const isContainsRequiredItems = Object.keys(this.fields).every((key) => key in data);
        
        if (!isContainsRequiredItems) {
          this.setFormMessage("Все поля должны быть заполнены правильно", "error");
        } else {
          const fd = Object.keys(data).reduce((acc, key) => {
            acc[key] = data[key].model;
            
            return acc;
          }, {});

          const res = this.$store.dispatch("auth.store/login", fd);

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