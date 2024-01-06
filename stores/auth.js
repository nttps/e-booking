// store/auth.ts
import { defineStore } from "pinia";


;
export const useAuthStore = defineStore("auth-store", {
    state: () => ({
        user: localStorage.getItem("user"),
        token: localStorage.getItem("token"),
        isLogin: false,
    }),
    getters: {
        isLoggedIn: (state) => !!state.user,
        isAdmin: (state) => state.info?.jobLevel !== "อปท.",
        level: (state) => state.user?.currentUserInfo.jobLevel,
        provinceNo: (state) => state.user?.currentUserInfo.addrProvince,
        aptCode: (state) => state.user?.currentUserInfo.aptCode,
        lat: (state) => state.info?.lat,
        lon: (state) => state.info?.lon,
        username: (state) => state.user?.currentUser || "",
        fullName: (state) => state.user?.currentUserInfo?.fullName || "",
        firstName: (state) => state.user?.currentUserInfo?.firstName || "",
        lastName: (state) => state.user?.currentUserInfo?.lastName || "",
        prefix: (state) => state.user?.currentUserInfo?.title || "",
    },
    actions: {
        async login(loginForm) {
            const config = useRuntimeConfig();
            const baseUrl = `${config.public.apiUrl}/AppsLogin/LoginMini`;

            await $fetch(`${baseUrl}`, {
                method: "POST",
                body: loginForm,
            })
                .then((response) => {
                    /* Update Pinia state */
                    if (response.loginResult == "fail")
                        throw response.loginResultInfo;

                    this.user = response;
                    this.token = this.user.currentUserInfo.jwtToken;
                    this.isLogin = true;

                    /* Store user in local storage to keep them logged in between page refreshes */
                    localStorage.setItem("user", JSON.stringify(this.user));
                    localStorage.setItem("token", JSON.stringify(this.token));
                    localStorage.setItem(
                        "isLogin",
                        JSON.stringify(this.isLogin)
                    );
                })
                .catch((error) => {
                    throw error;
                });
        },
        logout() {
            this.user = null;
            this.token = null;
            this.isLogin = false;
            localStorage.removeItem("auth-store");
        },
    },
    persist: {
        storage: persistedState.localStorage,
    },
});
