export default defineAppConfig({
    ui: {
        primary: "amber",
        input: {
            color: {
                white: {
                    outline:
                        "shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-b-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-b-2 focus:ring-orange-500",
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
            tbody: "bg-white",
            td: {
                base: "first:border-l border-r border-b border-[#FFA800] ",
                size: "text-base",
            },
            th: {
                base: "bg-[#FFA800] text-lg text-center first:rounded-tl-[10px] last:rounded-tr-[10px] border-[#FFA800]",
                size: "text-base",
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
