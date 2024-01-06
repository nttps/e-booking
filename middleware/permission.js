import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (_to, from) => {

    console.log(useAuthStore);
    console.log(from);

    if (
        !useAuthStore
        //_to.path === `/forms/${_to.params.id}/public`
    ) {
        return;
    } else {
        return navigateTo(`/forms/${_to.params.id}`);
    }
});
