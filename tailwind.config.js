export default {
    theme: {
        extend: {
            animation: {
                marquee: "marquee 4s linear infinite",
            },
            keyframes: {
                marquee: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-100%)" },
                },
            },
        },
    },
};
