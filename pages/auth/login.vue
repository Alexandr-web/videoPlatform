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
  };
</script>