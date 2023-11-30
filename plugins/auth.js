
export default defineNuxtPlugin(({ $pinia }) => {
    return {
        provide: {
            auth: useAuthStore($pinia),
        },
    };
});
