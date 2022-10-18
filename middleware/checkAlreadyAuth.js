import jwtDecode from "jwt-decode";

export default async ({ store, redirect, }) => {
  try {
    store.dispatch("auth.store/autoLogin");

    const token = store.getters["auth.store/getToken"];

    if (token) {
      const data = jwtDecode(token);
      const res = await store.dispatch("user.store/getOne", data.id);

      if (!res.user) {
        return store.commit("auth.store/clearToken");
      }

      return redirect("/");
    }
  } catch (err) {
    throw err;
  }
};