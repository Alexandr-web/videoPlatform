<template>
  <div class="auth">
    <div class="container">
      <div class="auth__inner">
        <div class="auth__block">
          <h1 class="auth__title">
            Регистрация
          </h1>
          <vForm
            :valid-params="validParams"
            :fields="fields"
            :classes="['auth__form']"
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
      validParams: [
        {
          name: "nickname",
          rules: {
            minLength: 3,
            required: true,
          },
        },
        {
          name: "email",
          rules: {
            email: true,
            required: true,
          },
        },
        {
          name: "password",
          rules: {
            required: true,
            minLength: 6,
          },
        }
      ],
      fields: {
        nickname: {
          title: "Никнейм",
          type: "text",
        },
        email: {
          title: "Электронная почта",
          type: "text",
        },
        password: {
          title: "Пароль",
          type: "password",
        },
      },
    }),
    head: { title: "Регистрация", },
  };
</script>