import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (_to, from) => {
    const app = useNuxtApp();
    const user = useAuthStore(app.$pinia);
});
