<template>
    
    <div id="profile-menu" class="absolute border z-50 text-left top-full -right-1 bg-white text-[#B6B6B6] text-xl py-2 w-[300px] rounded-[10px]">
        <ul>
            <li class="px-4 py-2">
                <SettingsLink to="/profile" class="flex items-center">
                    <Icon name="material-symbols:account-box-sharp" size="35px" class="text-amber-500" /> ข้อมูลผู้ใช้
                </SettingsLink>
            </li>

            <li class="px-4 py-2">
                <SettingsLink to="/settings" class="flex items-center">
                    <Icon name="material-symbols:settings-applications-sharp" size="35px" class="text-amber-500" /> ตั้งค่า
                </SettingsLink>
            </li>
          
            <li class="px-4 pt-3 border-t border-[#C0C0C0]">
                <SettingsLink @click="logout" class="flex items-center">ออกจากระบบ</SettingsLink>
            </li>
        </ul>
    </div>
</template>

<script setup>

const { $auth } = useNuxtApp();

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user.userInGroups.some(g => g.userGroupID === "ADMIN"))


const logout = () => {
    $auth.logout()

    navigateTo('/login')
}

const goToSetting = () => {
    if(isAdmin.value) {
        navigateTo('/settings/subject-categories')
    }else {
        navigateTo('/profile')
    }

}
</script>

<style lang="scss" scoped>

</style>