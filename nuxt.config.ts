// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    devtools: { enabled: false },
    modules: [
        "@nuxtjs/google-fonts",
        "nuxt-icon",
        "@nuxt/ui",
        "nuxt-swiper",
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
            api: {
                department: {
                    lists: "/el/Department/ListData",
                    save: "/el/Department/Save",
                    read: "/el/Department/GetDocSet",
                    delete: "/el/Department/DeleteDoc",
                },
                jobType: {
                    lists: "/el/JobType/ListData",
                    save: "/el/JobType/Save",
                    read: "/el/JobType/GetDocSet",
                    delete: "/el/JobType/DeleteDoc",
                },
                jobLevel: {
                    lists: "/el/JobLevel/ListData",
                    save: "/el/JobLevel/Save",
                    read: "/el/JobLevel/GetDocSet",
                    delete: "/el/JobLevel/DeleteDoc",
                },
                category: {
                    lists: "/el/Cate/ListData",
                    save: "/el/Cate/Save",
                    read: "/el/Cate/GetDocSet",
                    delete: "/el/Cate/DeleteDoc",
                    status: "/el/Cate/ListStatus",
                },
                group: {
                    lists: "/el/Group/ListData",
                    save: "/el/Group/Save",
                    read: "/el/Group/GetDocSet",
                    delete: "/el/Group/DeleteDoc",
                },
                type: {
                    lists: "/el/Type/ListData",
                    save: "/el/Type/Save",
                    read: "/el/Type/GetDocSet",
                    delete: "/el/Type/DeleteDoc",
                },
                course: {
                    lists: "/el/Course/ListData",
                    read: "/el/Course/GetDocSet",
                    save: "/el/Course/Save",
                    delete: "/el/Course/DeleteDoc",
                    uploadCover: "/file/Upload/UploadCourseCover",
                    get: "/el/Course/GetDocSet",
                    addOpening: "/el/Course/AddOpening",
                    deleteOpening: "/el/Course/DeleteOpening",
                    addPermission: "/el/Course/AddPermission",
                    deletePermission: "/el/Course/DeletePermission",
                    report: "/el/Course/PrintData",
                },
                subject: {
                    lists: "/el/Subject/ListData",
                    read: "/el/Subject/GetDocSet",
                    save: "/el/Subject/Save",
                    delete: "/el/Subject/DeleteDoc",
                    uploadCover: "/file/Upload/UploadSubjectCover",
                    addSubjectToCourse: "/el/Subject/AddSubjectToCourse",
                    deleteSubjectToCourse: "/el/Subject/DeleteSubjectInCourse",
                    addOpening: "/el/Subject/AddOpening",
                    deleteOpening: "/el/Subject/DeleteOpening",
                    addPermission: "/el/Subject/AddPermission",
                    deletePermission: "/el/Subject/DeletePermission",
                    report: "/el/Subject/PrintData",
                },
                trainer: {
                    lists: "/el/Person/ListTrainer",
                },
                listSubjectGroupCate: "/el/Subject/ListSubjectGroupCate",
                listCourseGroup: "/el/Course/ListCourseGroupCate",
                lesson: {
                    save: "/el/Lesson/Save",
                    read: "/el/Lesson/GetDocSet",
                    delete: "/el/Lesson/DeleteDoc",
                    uploadPDF: "/file/Upload/UploadLessonFile",
                    uploadMp4: "/file/Upload/UploadVDO",
                    deleteFile: "/el/Lesson/DeleteMedia",
                },
                register: {
                    lists: "/el/Register/ListRegister",
                    save: "/el/Register/Save",
                    delete: "/el/Register/DeleteDoc",
                    check: "/el/Register/GetDocSetByUser",
                    read: "/el/Register/GetDocSet",
                    block: "/el/Register/SetBlockUnBlock",
                    listRegisterForBlock: "/el/Register/ListRegister",
                    report: "/el/Register/PrintRegister",
                },
                auth: {
                    change: "AppsLogin/ChangeNewPassword",
                },
                quiz: {
                    lists: "/el/Quiz/ListQuiz",
                    save: "/el/Quiz/AddQuiz",
                    delete: "/el/Quiz/DeleteQuiz",
                    read: "/el/Quiz/ListQuizSet",
                    upload: "/el/Quiz/UploadQuiz",
                    download: "/el/Quiz/DownloadQuiz",
                },
                answer: {
                    save: "/el/Quiz/AddAnswer",
                    delete: "/el/Quiz/DeleteAnswer",
                },
                learning: {
                    updateLearning: "/el/Learning/UpdateLearningInLesson",
                    printCertificate: "/el/Learning/PrintCertificate",
                },
                learnQuiz: {
                    lists: "/el/LearnQuiz/ListQuizSet",
                    setAnswer: "/el/LearnQuiz/SetAnswer",
                    submitTest: "/el/LearnQuiz/SubmitTest",
                    listSubjectExam: "/el/LearnQuiz/ListSubjectPendingCheck",
                    listWritingAnswerForCheck:
                        "/el/LearnQuiz/ListWritingAnswerForCheck",
                    listUserInSubjectPendingCheck:
                        "/el/LearnQuiz/ListUserInSubjectPendingCheck",
                    writingCheck: "/el/LearnQuiz/WritingCheck",
                    download: "/el/Quiz/DownloadQuiz",
                    downloadQuizCheck: "/el/LearnQuiz/DownloadQuizCheck",
                    uploadQuizCheck: "/el/LearnQuiz/UploadQuizCheck",
                },

                history: {
                    learnHistories: "/el/Person/ListLearnHistory",
                    learnGet: "/el/Person/GetHistorySet",
                },
                notification: {
                    create: "/notify/CreateNotifyRecord",
                    lists: "/notify/ListNotify",
                    readMark: "/notify/SetRead",
                },
                config: {
                    lists: "/el/Config/ListConfig",
                    save: "/el/Config/SetConfig",
                    upload: "/file/Upload/UploadSignatureAndBackground",
                },
                person: {
                    listLoginHistory: "/el/Person/ListLoginHistory",
                    listSubjectHistory: "/el/Person/ListSubjectHistory",
                    listEveryOneHistory: "/el/Person/ListEveryOneLearnHistory",
                    listDownloadEveryOneHistory:
                        "/el/Person/PrintEveryOneLearnHistory",
                    listUsers: "/el/Person/ListUserInfo",
                    blockUser: "/el/Person/SetBlockUnBlock",
                },
                faqs: {
                    lists: "/el/FAQ/ListData",
                    save: "/el/FAQ/Save",
                    read: "/el/FAQ/GetDocSet",
                    delete: "/el/FAQ/DeleteDoc",
                },
            },
        },
    },
});
