<template>

    <div class="p-4 rounded-[20px] relative mb-10 text-2xl">
       
            <div class="flex mb-2 border-b py-4">
                <div class="text-[#959595] w-1/2"> ชื่อ-นามสกุล</div>
                <div>{{ authStore.user.currentUserInfo.fullName }}</div>
            </div>
            <div class="flex mb-2 border-b py-4 ">
                <div class="text-[#959595] w-1/2"> หน่วยงาน</div>
                <div>{{ authStore.user.currentUserInfo.departmentID }}</div>
            </div>
            <div class="flex mb-2 border-b py-4">
                <div class=" text-[#959595] w-1/2">ตำแหน่ง</div>
                <div>{{ authStore.user.currentUserInfo.positionID }}</div>
            </div>
            <div class="flex mb-2 border-b py-4">
                <div class=" text-[#959595] w-1/2">ระดับ</div>
                <div>{{ authStore.user.currentUserInfo.jobLevel || '-' }}</div>
            </div>
            <div class="flex mb-2 border-b py-4">
                <div class="text-[#959595] w-1/2">กอง</div>
                <div>{{ authStore.user.currentUserInfo.defaultCompany }}</div>
            </div>
    </div>
</template>


<script setup>
    
    definePageMeta({ 
        layout: 'settings', 
        title: 'การตั้งค่า', 
        key: {
            title: 'การตั้งค่าส่วนตัว',
            icon: "ic:round-settings"
        },
        middleware: 'auth'
    })

    const authStore = useAuthStore()

</script>