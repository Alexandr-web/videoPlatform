<template>
  <div class="profile-page pt-120 pb-20">
    <div class="container">
    </div>
  </div>
</template>

<script>
  export default {
    name: "ProfilePage",
    layout: "default",
    validate({ store, params: { id, }, }) {
      if (isNaN(+id)) {
        return false;
      }

      const res = store.dispatch("user.store/getOne", id);

      return res
        .then(({ ok, user, }) => [ok, user].every(Boolean))
        .catch((err) => {
          throw err;
        });
    },
  };
</script>