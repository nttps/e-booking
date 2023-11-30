<template>
    <ul class="">
        
    </ul>
</template>

<script setup>
const authStore = useAuthStore()


const isAdmin = computed(() => authStore.user.userInGroups.some(g => g.userGroupID === "ADMIN"))

</script>

<style lang="scss" scoped>

</style>