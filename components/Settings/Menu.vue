<template>
    <ul class="text-lg menu-left">
        <li>
            <span class="font-bold text-lg flex items-center"> <Icon name="ic:round-settings" size="30" /> <span class="ml-1">การตั้งค่าทั่วไป</span></span>
        </li>
        <li class="children">
            <SettingsLink to="/profile">ข้อมูลส่วนตัว</SettingsLink>
        </li>
        <li class="children">
            <SettingsLink to="">การแจ้งเตือน</SettingsLink>
        </li>
    </ul>
    <ul class="text-lg menu-left" v-if="authStore.isAdmin">
        <!-- <li>
            <span class="font-bold text-lg flex items-center"> <Icon name="ic:round-settings" size="30" /> <span class="ml-1">การตั้งค่า</span></span>
        </li>
        <li class="children">
            <SettingsLink to="/settings/booking">รายการจองห้องประชุม</SettingsLink>
        </li>
        <li class="children">
            <SettingsLink to="/settings/zoom">รายการจองระบบ Zoom</SettingsLink>
        </li>
       
        <li class="children">
            <SettingsLink to="">ประวัติการใช้งาน</SettingsLink>
        </li> -->
       
        <li>
            <span class="font-bold text-lg flex items-center"> <Icon name="ic:round-settings" size="30" /> <span class="ml-1">การตั้งค่าข้อมูลพื้นฐาน</span></span>
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
            <SettingsLink to="/settings/support">การสนับสนุนเจ้าหน้าที่</SettingsLink>
        </li>
        <li class="children">
            <SettingsLink to="/settings/amenities">สิ่งอำนวยความสะดวก</SettingsLink>
        </li>

        <!-- <li>
            <span class="font-bold text-lg flex items-center"> <Icon name="ic:round-settings" size="30" /> <span class="ml-1">การตั้งค่าข้อมูลการจองพาหนะ</span></span>
        </li>
        <li class="children">
            <SettingsLink to="/settings/vehicle">ประเภทรถยนต์</SettingsLink>
        </li>
        <li class="children">
            <SettingsLink to="/settings/drivers">พนักงานขับรถ</SettingsLink>
        </li> -->

        <li class="children">
            <SettingsLink to="/settings/log-history">ประวัติการใช้งาน</SettingsLink>
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