const isDev = process.env.NODE_ENV === "development";

// const apiBaseUrl = 'http://localhost:3001'
const apiBaseUrl =
    process.env.NUXT_PUBLIC_API_URL || "https://dpm-vote.gooddev.net/api";
const version = process.env.NUXT_PUBLIC_VERSION || "0.0.1";
const assetsDir = process.env.NUXT_BUILD_ASSETSDIR;
const baseURL = process.env.NUXT_BASE_URL;


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        buildAssetsDir: assetsDir,
        baseURL: baseURL,
    },
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
            cookieLifetime: 7,
            version: version,
            apiUrl: apiBaseUrl,
            authUrl: "",
        },
    },
});
