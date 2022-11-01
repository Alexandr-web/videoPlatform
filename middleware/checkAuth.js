import jwtDecode from "jwt-decode";
import getValidAvatarUrl from "../helpers/getValidAvatarUrl";

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
      store.commit("user.store/clearUser");

      return redirect("/auth/login");
    }

    const { id, } = data;
    const { ok, user, } = await store.dispatch("user.store/getOne", id);

    if (ok) {
      getValidAvatarUrl(user.avatar).then((avatar) => {
        store.commit("user.store/setUser", {
          ...user,
          avatar,
        });
      }).catch((err) => {
        throw err;
      });
    }
  } catch (err) {
    throw err;
  }
};