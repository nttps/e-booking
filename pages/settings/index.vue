<template>
    <div>

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



    if ( authStore.isAdmin) {
        await navigateTo('/settings/rent-rooms');
    }else {
        await navigateTo('/profile');
    }
</script>

<style lang="scss" scoped>

</style>