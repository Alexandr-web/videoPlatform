import jwtDecode from "jwt-decode";

export default async ({ store, redirect, }) => {
  try {
    store.dispatch("auth.store/autoLogin");

    if (!store.getters["auth.store/getToken"]) {
      return redirect("/auth/login");
    }

    const data = jwtDecode(store.getters["auth.store/getToken"]);
    const res = await store.dispatch("user.store/getOne", data.id);

    if (!res.user) {
      store.commit("auth.store/clearToken");

      return redirect("/auth/login");
    }
  } catch (err) {
    throw err;
  }
};