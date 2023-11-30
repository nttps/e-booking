<template>
    <header class="flex w-full justify-between px-2 lg:py-4 shadow-md">
        <nav
            class="
            flex
            items-center
            gap-x-8
            2xl:gap-x-0
            justify-between
            w-full
            py-4
            md:py-0
            2xl:px-4
            text-lg text-gray-700
            bg-white
            "
        >
            <div>
                <a href="#" class="flex justify-center items-center">
                    <img src="~/assets/images/logo.png" class="w-[70px]" alt="E-Learning Logo">
                    <div class="text-lg 2xl:text-2xl ml-4 font-semibold">
                        <div>DDPM</div> 
                        <div class="text-[#FFA133]">E-Learning</div> 
                    </div>
                </a>
            </div>
        
        
            <div class="hidden w-full md:flex md:items-center md:w-auto" id="menu">
                <ul
                    class="
                    text-base text-gray-700
                    lg:flex
                    lg:justify-between 
                    items-center
                    space-x-4"
                >
                    <li>
                        <ELink class="nav-header-li" to="/">หน้าแรก</ELink>
                    </li>
                    <li>
                        <ELink class="nav-header-li" to="/course-types">ประเภทหลักสูตร</ELink>
                    </li>
                    <li>
                        <ELink class="nav-header-li" to="/subjects">รายวิชา</ELink>
                    </li>
                    <li>
                        <ELink class="nav-header-li" to="/qa">คำถามที่พบบ่อย</ELink>
                    </li>
                    <li>
                        <ELink class="nav-header-li" to="/tutorial">คู่มือการใช้งาน</ELink>
                    </li>
                </ul>
                <div class="ml-8 hidden xl:block relative ">
                    <input type="text" v-model="searchText" @paste="search" @input="search" class="input-search" placeholder="ค้นหารายวิชาหรือหลักสูตร" ref="searchBar">
                    <ul
                        v-if="searchText.length > 0 || searchSubjects.length"
                        class="w-full rounded bg-white border border-gray-300 space-y-1 absolute z-10 text-sm mt-1"
                    >
                        <li class="px-1 py-2  font-bold border-b border-gray-200" v-if="searchText.length > 0 && searchText.length < 3">
                            พิมพ์คำค้นหามากกว่า 3 ตัวอักษร
                        </li>
                        <li v-if="searchSubjects.length" class="px-2 pt-1 font-bold text-lg">วิชา</li>
                        <li
                            v-if="searchSubjects.length"
                            v-for="subject in searchSubjects"
                            :key="subject.subject_name"
                            @click="toSearch(`/subjects/${subject.subject_id}`)"
                            class="cursor-pointer hover:bg-gray-100 px-4 py-1 truncate"
                        >
                        {{ subject.subject_name }}
                        </li>
                        <li v-if="searchCourses.length" class="px-2 pt-1 font-bold text-lg">หลักสูตร</li>
                        <li
                            v-for="course in searchCourses"
                            :key="course.course_name"
                            @click="toSearch(`/course/${course.course_id}`)"
                            class="cursor-pointer hover:bg-gray-100 px-4 py-1 truncate"
                        >
                            {{ course.course_name }}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex relative">
                <button type="button" class="relative" @click="notificationBar = true" ref="buttonNotificationRef">
                    <img :src="`${notifications.length > 0 ? `/images/notification.svg`: `/images/no-notification.svg`}`" class="w-[50px]" alt="">
                </button>

                <USlideover v-model="notificationBar">
                    <Notification :notifications="notifications" @refresh="fetchNotification"/>
                </USlideover>
                
                <button type="button" class="flex justify-center items-center space-x-4 relative" @click="toggleMenuBar"  ref="buttonProfileRef">
                    <div class="flex justify-center items-center">
                        <img src="~/assets/images/user.svg" class="w-[38px] ml-4 mr-2" alt="">
                        {{ $auth.user.currentUser }}
                    </div>
                    <Icon name="solar:alt-arrow-down-outline" class="text-3xl" color="#3E3E3E" />
                     <ProfileMenu  v-if="menuBar"/>
                </button>
               
            </div>
        </nav>
        
    </header>

    <div class="bg-[#494949] lg:pb-16 mb-10">
        <div class="md:flex justify-between w-4/5 pt-8 pb-16 mx-auto md:px-10 lg:px-14">
            <div class="md:w-1/2 mb-5 md:mb-0">
                <h2 class="text-lg md:text-xl lg:text-3xl xl:text-4xl text-white flex font-thin">จองห้องประชุม</h2>
            </div>
        </div>
    </div>
</template>

<style>
    .input-search {
        padding-left: 1.1rem;
        padding-top: .25rem;
        padding-bottom: .25rem;
        @apply focus-visible:border-gray-400 outline-none rounded-[20px] border border-[#929292] flex items-center text-sm;

    }
    .nav-header-li {
        @apply px-2 2xl:px-8 py-2 block hover:bg-[#FFA800] hover:text-white rounded-[20px] transition delay-100;
    }
</style>

<script setup>

    const menuBar = ref(false)
    const notificationBar = ref(false)
    const buttonProfileRef = ref(null);
    const buttonNotificationRef = ref(null);
    const config = useRuntimeConfig();

    const autocompleteResult = ref()
    const searchText = ref('')
    const searchBar = ref()

    const user = useAuthStore();

    onClickOutside(
        buttonProfileRef,
        (event) => {
            menuBar.value = false
        },
    )

    onMounted(() => {
        fetchNotification();
    });


    const toggleMenuBar = () => {
        menuBar.value = !menuBar.value
        notificationBar.value = false
    }

    const searchSubjects = ref([])
    const searchCourses = ref([])

    

    const search = (e) =>{

        if (searchText.value === '') {
          return searchSubjects.value = []
        }

        if (searchText.value.length < 3) {
          return
        }

        const subjectUrl = config.public.apiUrl + config.public.api.subject.lists;

        var raw = JSON.stringify({
            "SearchText": e ? e.target.value : "",
            "Status": "เปิด",
            "Cate":"",//subject cate (หมวดวิชา)
            "Group":"",//subject group (กลุ่มวิชา)
            "IsAdmin": "0"
        });
        var requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: raw,
        };
        fetch(subjectUrl, requestOptions)
            .then(response => response.json())
            .then( json => {
                searchSubjects.value = json
            })
            .catch(error => console.log('error', error));

        const courseUrl = config.public.apiUrl + config.public.api.course.lists;

        var raw = JSON.stringify({
            "SearchText": e ? e.target.value : "",
            "Status": "เปิด",
            "Cate":"",//subject cate (หมวดวิชา)
            "Group":"",//subject group (กลุ่มวิชา)
            "IsAdmin": "0"
        });
        var requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: raw,
        };
        fetch(courseUrl, requestOptions)
            .then(response => response.json())
            .then( json => {
                searchCourses.value = json
            })
            .catch(error => console.log('error', error));

    }

    const notifications = ref([])

    const fetchNotification = async () => {
        const url = config.public.apiUrl + config.public.api.notification.lists;

        const res = await fetch(`${url}?username=${user.user.currentUser}&show_unread_only=y`)
        const data = await res.json()

        notifications.value = data
    }

    const toSearch = (url) => {
        navigateTo(url)

        searchText.value = ''
        searchSubjects.value = []
    }
</script>