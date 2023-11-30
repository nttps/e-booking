<template>
    
    <div id="profile-menu" class="absolute border z-10 text-left top-full -right-1 bg-white text-[#B6B6B6] text-2xl py-4 w-[340px] rounded-[10px]">
        <ul>
            <li class="px-8 py-2">
                <SettingsLink to="/profile" class="flex items-center">
                    <img src="~/assets/images/icon-profile-user.png" class="mr-2" alt=""> ข้อมูลผู้เรียน
                </SettingsLink>
            </li>
            <li class="px-8 py-2">
                <SettingsLink to="/courses-register" class="flex items-start"><img src="~/assets/images/icon-bookmark.png" class="mr-2" alt=""> 
                    หลักสูตรที่ลงทะเบียน</SettingsLink>
            </li>
            <li class="px-8 py-2">
                <SettingsLink to="/history" class="flex items-start"><img src="~/assets/images/icon-history.png" class="mr-2" alt=""> ประวัติการเรียนและผลการเรียนย้อนหลัง</SettingsLink>
            </li>
            <li class="px-8 py-2">
                <SettingsLink to="/certificate" class="flex items-center"><img src="~/assets/images/icon-certificate.png" class="mr-2" alt=""> ใบวุฒิบัตร</SettingsLink>
            </li>
            <!-- <li class="px-8 py-2">
                <SettingsLink to="/settings" class="flex items-center"><img src="~/assets/images/icon-settings.png" class="mr-2" alt=""> การตั้งค่า</SettingsLink>
            </li> -->
            <li class="px-8 py-2">
                <SettingsLink @click="goToSetting" class="flex items-center"><img src="~/assets/images/icon-settings.png" class="mr-2" alt="">การตั้งค่า</SettingsLink>
            </li>
            <li class="px-9 pt-4 border-t border-[#C0C0C0]">
                <SettingsLink @click="logout" class="flex items-center"><img src="~/assets/images/icon-logout.png" class="mr-2" alt=""> ออกจากระบบ</SettingsLink>
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