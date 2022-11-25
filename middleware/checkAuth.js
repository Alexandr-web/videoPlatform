import jwtDecode from "jwt-decode";

/**
 * This middleware is used on all pages, except pages with authorization
 * Checks if the user is logged in
 * Also, if the user exists, then set it to the store with a valid avatar
 */
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

    store.dispatch("user.store/getValidAvatarUrl", res.user.avatar).then((avatar) => {
      store.commit("user.store/setUser", {
        ...res.user,
        avatar,
      });
    }).catch((err) => {
      throw err;
    });
  } catch (err) {
    throw err;
  }
};