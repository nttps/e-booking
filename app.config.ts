export default defineAppConfig({
    ui: {
        primary: "orange",
        gray: "cool",
        input: {
            color: {
                white: {
                    outline:
                        "shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-0 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-orange-500",
                },
            },
            padding: {
                xs: "px-2 py-1.5",
                sm: "px-2 py-1.5",
            },
        },
        table: {
            default: {
                sortButton: {
                    class: "!text-lg",
                },
            },
            td: {
                base: "whitespace-nowrap first:border-l border-r border-b border-[#FFA800] truncate",
                size: "text-base",
            },
            th: {
                base: "bg-[#FFA800] text-lg text-center first:rounded-tl-[20px] last:rounded-tr-[20px] border-[#FFA800]",
                size: "text-lg",
            },
        },
        pagination: {
            wrapper: "flex items-center -space-x-px justify-end",
        },
        // modal: {
        //     width: "max-w-screen-xl",
        // },
        tabs: {
            list: {
                tab: {
                    padding: "px-0",
                    size: "text-lg",
                    active: "text-white bg-[#FFA800]",
                },
            },
        },
    },
});
