<template>
    <header class="flex w-full justify-between p-2 shadow-md">
        <nav
            class="
            flex
            items-center
            gap-x-8
            2xl:gap-x-0
            justify-between
            w-full
            text-lg text-gray-700
            bg-white
            "
        >
            <div>
                <a href="/" class="flex justify-center items-center">
                    <img src="~/assets/images/logo.png" class="w-[70px]" alt="E-Booking Logo">
                    <div class="text-xl 2xl:text-2xl ml-4">
                        <div>ระบบจองห้องประชุมออนไลน์</div> 
                        <div class="text-[#FFA133]">กรมป้องกันและบรรเทาสาธารณภัย</div> 
                    </div>
                </a>
            </div>
        
        
            <div class="flex relative">
                <button type="button" class="relative" @click="notificationBar = true" ref="buttonNotificationRef">
                    <img v-if="notifications.length > 0" src="~/assets/images/notification.svg" class="w-[50px]" alt="">
                    <img v-else src="~/assets/images/no-notification.svg" class="w-[50px]" alt="">

                   
                </button>

                <USlideover v-model="notificationBar">
                    <Notification :notifications="notifications" @refresh="refresh"/>
                </USlideover>
                
                <button type="button" class="flex justify-center items-center space-x-4 relative" @click="toggleMenuBar"  ref="buttonProfileRef">
                    <div class="flex justify-center items-center">
                        <img src="~/assets/images/user.svg" class="w-[38px] ml-4 mr-2" alt="">
                       
                        <div class="text-left leading-5">
                            <div>{{ user.fullName }}</div>
                            <div>หน่วยงาน: {{ user.department }}</div>
                        </div>
                    </div>
                    
                    <Icon name="solar:alt-arrow-down-outline" class="text-3xl" color="#3E3E3E" />
                     <ProfileMenu  v-if="menuBar"/>
                </button>
            </div>
        </nav>
        
    </header>

    <div class="bg-black/50 h-64 md:h-96 relative" v-if="tumbotron === undefined || tumbotron">
        <div class="absolute top-0 right-0 block w-full h-full">
            <img
            alt="Snowy mountain lake"
            class="object-cover min-w-full h-full"
            src="~/assets/images/bg-header.jpg"
            />
        </div>
        <div class="flex flex-col justify-around absolute w-full h-full py-4 lg:py-16 ">
            <h2 class="text-xl md:text-2xl lg:text-4xl xl:text-6xl text-white font-bold text-center mb-4">จองห้องประชุม</h2>
            <div class="grid grid-cols-4 gap-x-10 px-4 lg:px-20">
                <NuxtLink 
                    to="/" 
                    v-slot="{ isActive }" 
                >
                    <div 
                        class="rounded-lg border-amber-500 border-2 py-2 px-4  text-center text-2xl font-bold" 
                        :class="{ 'bg-amber-500': isActive, 'text-white': !isActive}"
                    >
                        จองห้องประชุม
                    </div>
                    
                </NuxtLink>
                <NuxtLink 
                    to="/zoom" 
                    v-slot="{ isActive }" 
                >
                    <div 
                        class="rounded-lg border-amber-500 border-2 py-2 px-4  text-center text-2xl font-bold" 
                        :class="{ 'bg-amber-500': isActive, 'text-white': !isActive}"
                    >
                        จองระบบ Zoom
                    </div>
                    
                </NuxtLink>
                <NuxtLink 
                    to="/booking-list" 
                    v-slot="{ isActive }" 
                >
                    <div 
                        class="rounded-lg border-amber-500 border-2 py-2 px-4  text-center text-2xl font-bold" 
                        :class="{ 'bg-amber-500': isActive, 'text-white': !isActive}"
                    >
                        รายการจองห้องประชุม{{ user.isAdmin ? `` : `ของฉัน` }}
                    </div>

                    
                </NuxtLink>
                <NuxtLink 
                    to="/calendar" 
                    v-slot="{ isActive }" 
                >
                    <div 
                        class="rounded-lg border-amber-500 border-2 py-2 px-4  text-center text-2xl font-bold" 
                        :class="{ 'bg-amber-500': isActive, 'text-white': !isActive}"
                    >
                        ปฎิทิน
                    </div>
                </NuxtLink>
            </div>
        </div>
       
           
    </div>
</template>

<style>
   
</style>

<script setup>

    const menuBar = ref(false)
    const notificationBar = ref(false)
    const buttonProfileRef = ref(null);
    const buttonNotificationRef = ref(null);
    const props = defineProps(['tumbotron'])
    const user = useAuthStore();

    onClickOutside(
        buttonProfileRef,
        (event) => {
            menuBar.value = false
        },
    )

    onMounted(() => {
    });


    const toggleMenuBar = () => {
        menuBar.value = !menuBar.value
        notificationBar.value = false
    }


    const { data: notifications, pending, refresh } = await useAsyncData('notifications', async () => await getApi(`/bk/book/ListNotify?user=${user.username}`))
</script>