import jwtDecode from "jwt-decode";

export default async ({ store, redirect, }) => {
  try {
    store.dispatch("auth.store/autoLogin");

    const token = store.getters["auth.store/getToken"];

    if (!token) {
      return redirect("/auth/login");
    }

    const data = await jwtDecode(token);
    const res = await store.dispatch("user.store/getOne", data.id);

    if (!res.user) {
      store.commit("auth.store/clearToken");

      return redirect("/auth/login");
    }

    const { id, } = data;
    const { ok, user, } = await store.dispatch("user.store/getOne", id);

    if (ok) {
      store.commit("user.store/setUser", user);
    }
  } catch (err) {
    throw err;
  }
};