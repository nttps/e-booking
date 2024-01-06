<template>
    <ul class="text-lg menu-left">
        <li>
            <span class="font-bold text-lg flex items-center"> <Icon name="ic:round-settings" size="30" /> <span class="ml-1">การตั้งค่าทั่วไป</span></span>
        </li>
        <li class="children">
            <SettingsLink to="">ข้อมูลส่วนตัว</SettingsLink>
        </li>
        <li class="children">
            <SettingsLink to="">การแจ้งเตือน</SettingsLink>
        </li>
        <li class="children">
            <SettingsLink to="">ประวัติการเข้าใช้งาน</SettingsLink>
        </li>
        <li>
            <span class="font-bold text-lg flex items-center"> <Icon name="ic:round-settings" size="30" /> <span class="ml-1">การตั้งค่า</span></span>
        </li>
        <li class="children">
            <SettingsLink to="/settings/booking">รายการจอง</SettingsLink>
        </li>
        <li class="children">
            <SettingsLink to="/settings/rent-rooms">ห้องประชุม</SettingsLink>
        </li>
        <li class="children">
            <SettingsLink to="/settings/objective">วัตถุประสงค์</SettingsLink>
        </li>
        <li class="children">
            <SettingsLink to="/settings/locations">ตำแหน่งในที่ประชุม</SettingsLink>
        </li>
        <li class="children">
            <SettingsLink to="">ประวัติการใช้งาน</SettingsLink>
        </li>
    </ul>
</template>

<script setup>
const authStore = useAuthStore()


const isAdmin = computed(() => authStore.user.userInGroups.some(g => g.userGroupID === "ADMIN"))

</script>

<style lang="scss" scoped>
.menu-left {
    li {
        @apply my-2
    }

    li.children {
        @apply ml-8
    }
}
</style>