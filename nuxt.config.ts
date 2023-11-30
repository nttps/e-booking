// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    devtools: { enabled: false },
    modules: [
        "@nuxtjs/google-fonts",
        "nuxt-icon",
        "@nuxt/ui",
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "@vueuse/nuxt",
    ],
    css: [
        // CSS file in the project
        "@/assets/css/main.css",
    ],
    imports: {
        dirs: ["stores"],
    },
    pinia: {
        autoImports: ["defineStore", "definePiniaStore"],
    },
    googleFonts: {
        display: "swap",
        prefetch: true,
        preconnect: true,
        families: {
            Kanit: true,
        },
    },
    colorMode: {
        preference: "light",
    },
    runtimeConfig: {
        public: {
            version: "",
            apiUrl: "",
            baseFileUrl: "",
        },
    },
});
