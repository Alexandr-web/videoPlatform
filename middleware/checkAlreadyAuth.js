import jwtDecode from "jwt-decode";

export default async ({ store, redirect, }) => {
  try {
    store.dispatch("auth.store/autoLogin");

    const token = store.getters["auth.store/getToken"];

    if (token) {
      const data = jwtDecode(token);
      const res = await store.dispatch("user.store/getOne", data.id);

      if (!res.user) {
        store.commit("auth.store/clearToken");
        store.commit("user.store/clearUser");
        return;
      }

      return redirect("/");
    }
  } catch (err) {
    throw err;
  }
};