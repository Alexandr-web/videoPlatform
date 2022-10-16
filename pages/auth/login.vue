<template>
  <div class="auth">
    <div class="container">
      <div class="auth__inner">
        <div class="auth__block">
          <h1 class="auth__title">
            Вход
          </h1>
          <vForm
            :valid-params="validParams"
            :fields="fields"
            :classes="['auth__form']"
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
      validParams: [
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
    head: { title: "Вход", },
  };
</script>