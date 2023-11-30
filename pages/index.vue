<template>
    <div class="bg-[#494949] lg:pb-16 mb-10">
        <div class="md:flex justify-between w-4/5 pt-8 pb-16 mx-auto md:px-10 lg:px-14">
            <div class="md:w-1/2 mb-5 md:mb-0">
                <h2 class="text-lg md:text-xl lg:text-3xl xl:text-4xl text-white flex font-thin">จองห้องประชุม</h2>
            </div>
        </div>
    </div>

 
</template>


<script setup>
    definePageMeta({
        title: 'ความรู้มุ่งสู่ความสำเร็จ',
        middleware: 'auth'
    })

    const config = useRuntimeConfig();
    const recommandCourses = ref([])
    const courses = ref([])
    const subjects = ref([])
    const authStore = useAuthStore()



    onMounted(() => {
        fetchDataCourse();
        fetchDataRecommand()
        fetchDataSubject()

    });

    const myHeaders = new Headers();
    const url = config.public.apiUrl + config.public.api.course.lists;


    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "SearchText": "",
        "Status": "",
        "Status": "เปิด",
        "LitmitRow": "10",
        "Type":"",//course type(กลุ่มวิชา)
        "Cate":"",//course cate (หมวดวิชา)
        "Group":"",//course group (กลุ่มหมวดวิชา)
        "Random": 1,
        "user": authStore.user.currentUser,//current user login
    });

    const raw2 = JSON.stringify({
        "SearchText": "",
        "Status": "",
        "Status": "เปิด",
        "LitmitRow": "10",
        "Type":"",//course type(กลุ่มวิชา)
        "Cate":"",//subject cate (หมวดวิชา)
        "Group":"",//subject group (กลุ่มวิชา)
        "Random": 1,
        "user": authStore.user.currentUser,//current user login
    });

    const fetchDataCourse = () => {
        fetch(url, {
            method: 'POST',
            body: raw,
            headers: myHeaders,
        })
            .then(response => response.json())
            .then( json => {
                courses.value = json
            })
        .catch(error => console.log('error', error));
    }
    const fetchDataRecommand = () => {
    
        fetch(url, {
            method: 'POST',
            body: raw2,
            headers: myHeaders,
        })
            .then(response => response.json())
            .then( json => {
                recommandCourses.value = json
            })
        .catch(error => console.log('error', error));
    }

    const fetchDataSubject = () => {
        const url = config.public.apiUrl + config.public.api.subject.lists;

        fetch(url, {
            method: 'POST',
            body: raw,
            headers: myHeaders,
        })
            .then(response => response.json())
            .then( json => {
                subjects.value = json
            })
        .catch(error => console.log('error', error));
    }

</script>



<style lang="scss">
    .search-form {
        @apply flex flex-col items-center mb-4 md:mb-20;
    }

    .input-form {
    }
    .input-form input {
        @apply border rounded p-1.5 md:p-2.5 outline-none md:w-[514px] text-xl;
    }
    

    .course-item {
        box-shadow: 0px 4px 4px 0px #00000040;
    }


    $width: 100%;

    @mixin half-circle ($direction: right) {
        @if $direction == right {
            border-radius: 0 100% 100% 0 / 0 50% 50% 0;
        }
        @else if $direction == left {
            border-radius: 100% 0 0 100% / 50% 0 0 50%;
        }
        @else if $direction == top {
            border-radius: 50% 50% 0 0 / 100% 100% 0 0;
        }
        @else if $direction == bottom {
            border-radius: 0 0 50% 50% / 0 0 100% 100%;
        }
        @else {
            @error 'Please set correct $direction value.'
        }
    }

    .half-circle {
        background-color: #FFA133;
        &.horizontal {
            width: $width;
        }

        @media (min-width: 768px) {
            &.horizontal {
                font-size: 1rem/* 16px */;
                border-radius: 0 0 50% 50% / 0 0 100% 100%;
            }
        }
    }

    .page-item {
        @apply w-12 border border-[#959595] md:flex justify-center items-center hidden text-2xl  cursor-pointer transition duration-150 ease-in hover:bg-[#FFA133] hover:text-white rounded-[4px];
    }
</style>