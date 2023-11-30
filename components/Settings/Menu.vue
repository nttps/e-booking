<template>
    <ul class="">
        <li class="xl:py-3">
            <SettingsLink to="/profile" class="flex items-center hover:text-[#FF8A00] xl:text-2xl">
                <img src="~/assets/images/icon-profile-user.png" class="mr-2" alt=""> ข้อมูลผู้เรียน
            </SettingsLink>
        </li>
        <li class="xl:py-3">
            <SettingsLink to="/courses-register" class="flex items-start hover:text-[#FF8A00] 2xl:text-2xl">
                <img src="~/assets/images/icon-bookmark.png" class="mr-2" alt=""> 
                หลักสูตรที่ลงทะเบียน
            </SettingsLink>
        </li>
        <li class="xl:py-3">
            <SettingsLink to="/history" class="flex items-start hover:text-[#FF8A00] 2xl:text-2xl">
                <img src="~/assets/images/icon-history.png" class="mr-2" alt=""> ประวัติการเรียนและผลการเรียนย้อนหลัง
            </SettingsLink>
        </li>
        <li class="xl:py-3">
            <SettingsLink to="/certificate" class="flex items-center hover:text-[#FF8A00] 2xl:text-2xl">
                <img src="~/assets/images/icon-certificate.png" class="mr-2" alt=""> ใบวุฒิบัตร
            </SettingsLink>
        </li>
        <li class="xl:py-3 relative">
            <SettingsLink to="/settings" class="flex items-center hover:text-[#FF8A00] 2xl:text-2xl">
                <img src="~/assets/images/icon-settings.png" class="mr-2" alt="">
                การตั้งค่าส่วนตัว</SettingsLink>
        </li>
        <li class="xl:py-3" v-if="isAdmin">
            <button type="button"  class="flex items-center hover:text-[#FF8A00] 2xl:text-2xl">
                <img src="~/assets/images/icon-settings.png" class="mr-2" alt="">
                การตั้งค่า
               
            </button>
            <ul class="bg-white text-black pl-12 py-4 px-10 w-full rounded">
                <li>
                    <span class="text-xl font-bold">หลักสูตร / รายวิชา</span> 
                </li>
                <!-- <li class="py-2 pl-2">
                    <SettingsLink to="/settings/training-agency" class="hover:text-[#FF8A00] text-lg">หน่วยงานจัดฝึกอบรม</SettingsLink>
                </li>  -->
               
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/subject-categories" class="hover:text-[#FF8A00] text-lg">หมวดวิชา</SettingsLink>
                </li> 
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/subject-groups" class="hover:text-[#FF8A00] text-lg">กลุ่มวิชา</SettingsLink>
                </li> 
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/type-course" class="hover:text-[#FF8A00] text-lg">ประเภทหลักสูตร</SettingsLink>
                </li> 
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/categories" class="hover:text-[#FF8A00] text-lg">หมวดวิชาหลักสูตร</SettingsLink>
                </li>
               
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/course-groups" class="hover:text-[#FF8A00] text-lg">กลุ่มหลักสูตร</SettingsLink>
                </li> 
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/subjects" class="hover:text-[#FF8A00] text-lg">รายวิชา / บทเรียน / ข้อสอบ</SettingsLink>
                </li>
               
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/courses" class="hover:text-[#FF8A00] text-lg">หลักสูตร</SettingsLink>
                </li> 
                <li>
                    <span class=" text-xl font-bold">คลังข้อมูล</span> 
                </li>
                <!-- <li class="py-2 pl-2">
                    <SettingsLink to="/settings/exams" class="hover:text-[#FF8A00] text-lg">คลังข้อสอบ</SettingsLink>
                </li>  -->
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/check-exam" class="hover:text-[#FF8A00] text-lg">ตรวจแบบทดสอบ</SettingsLink>
                </li> 
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/certificates" class="hover:text-[#FF8A00] text-lg">ประกาศนียบัตร</SettingsLink>
                </li> 
               
                <li>
                    <span class="text-xl font-bold">ผู้ใช้งาน</span> 
                </li>
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/departments" class="hover:text-[#FF8A00] text-lg">หน่วยงาน</SettingsLink>
                </li>
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/job-type" class="hover:text-[#FF8A00] text-lg">ตำแหน่ง</SettingsLink>
                </li>
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/job-level" class="hover:text-[#FF8A00] text-lg">ระดับ</SettingsLink>
                </li>
                <!-- <li class="py-2 pl-2">
                    <SettingsLink to="/settings/user-groups" class="hover:text-[#FF8A00] text-lg">กลุ่มผู้ใช้งาน</SettingsLink>
                </li> -->
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/users" class="hover:text-[#FF8A00] text-lg">ข้อมูลผู้ใช้งาน</SettingsLink>
                </li> 
                <li>
                    <span class="text-xl font-bold">รายงาน</span> 
                </li>
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/reports/courses-subjects" class="hover:text-[#FF8A00] text-lg">หลักสูตร / วิชาเรียน </SettingsLink>
                </li>
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/reports/register" class="hover:text-[#FF8A00] text-lg">ผู้ลงทะเบียน</SettingsLink>
                </li>
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/histories" class="hover:text-[#FF8A00] text-lg">ความก้าวหน้าการเข้าอบรม </SettingsLink>
                </li> 
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/reports/activities" class="hover:text-[#FF8A00] text-lg">บัททึกกิจกรรมการใช้งาน</SettingsLink>
                </li> 
                <li>
                    <span class="text-xl font-bold">อื่นๆ</span> 
                </li>
                <li class="py-2 pl-2">
                    <SettingsLink to="/settings/faqs" class="hover:text-[#FF8A00] text-lg">คำถามที่พบบ่อย</SettingsLink>
                </li> 
                 <li class="py-2 pl-2">
                    <SettingsLink to="/settings/configs" class="hover:text-[#FF8A00] text-lg">ตั้งค่าใบประกาศนียบัตร</SettingsLink>
                </li> 
            </ul>
        </li>
    </ul>
</template>

<script setup>
const authStore = useAuthStore()


const isAdmin = computed(() => authStore.user.userInGroups.some(g => g.userGroupID === "ADMIN"))

</script>

<style lang="scss" scoped>

</style>