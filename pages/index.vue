<template>
    <h2 class="text-3xl font-bold mb-4">จองห้องประชุม</h2>
    <div class="text-xl font-bold">กรองช่วงเวลาที่จอง</div>
    <div class="flex space-x-4 mb-4">
        <div class="w-3/6">
            
            <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="xl" :label="labelStartDate" />
                <template #panel="{ close }">
                    <FormDatePicker v-model="searchDateBegin" @close="close" :date-time="true" />
                </template>
            </UPopover>
            <div v-if="!isValidDateRange" class="text-red-500 text-sm">
                *วันที่เริ่มต้องไม่เกินวันที่สิ้นสุด
            </div>
        </div>
        <div class="w-3/6">
            <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="xl" :label="labelEndDate" />
                <template #panel="{ close }">
                    <FormDatePicker v-model="searchDateEnd" :min-date="searchDateBegin" @close="close" :date-time="true"/>
                </template>
            </UPopover>
        </div>
    </div>
    <div class="flex space-x-4 mb-4">
        <div class="w-4/6">
            <UInput placeholder="ชื่อห้องประชุม" v-model="nameSearch" size="xl" />
        </div>
        <div class="w-2/6">
            <UInput placeholder="จำนวนผู้เข้าประชุมหรือมากกว่า" v-model="capacitySearch" size="xl" />
        </div>
    </div>

    <div class="flex space-x-4">
        <div class="w-3/6">
            <UInput placeholder="อาคาร" v-model="buildingSearch" size="xl" />
        </div>
        <div class="w-2/6">
            <USelect :options="['ปกติ', 'ปิดการใช้งาน']" v-model="statusSearch" placeholder="สถานะ" size="xl" />
        </div>
        <div class="w-1/6 text-center">
            <UButton label="ค้นหา" size="xl" />
            <UButton label="รีเซ็ท" color="gray" size="xl" class="ml-4" @click="resetSearch" />

        </div>
    </div>


    <div class="bg-white grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-4 mt-4" >
        <div class="space-x-4 p-4 mt-4 bg-[#ffe5b1] border-2 border-[#FFA800] rounded-md" v-for="room in rooms.slice((page - 1) * pageCount, (page) * pageCount)" v-if="rooms.length > 0">
            <img :src="room.photo ? room.photo_url : `${config.public.baseUrl ? config.public.baseUrl  : '/'}images/no-cover.jpg`" class="h-[250px] mx-auto mb-2" alt="">
            <div>
                <div class="text-center">
                    <div class="font-bold text-xl mb-2 text-center">{{ room.room_name }}</div>
                    <div class="flex items-center justify-between space-x-2 mb-2 text-white-500">
                        <div>
                            <Icon name="heroicons:user-group-20-solid" size="30px" /> <span>{{ room.capacity }}</span>
                        </div>
                        <div>
                            <Icon name="clarity:building-line" size="30px" /> <span>{{ room.building_id }}</span>
                        </div>
                       <div>
                         <span>หน่วยงาน </span><span>{{ room.department_id }}</span>
                       </div>
                    </div>
                    <!-- <div class="flex items-center space-x-2 mb-2 text-gray-500 text-lg">
                        <span>สถานะ</span> <span class="rounded-full px-4 text-black" :class="{ 'bg-green-400': room.status === 'ปกติ', 'bg-red-400': room.status !== 'ปกติ'}">{{ room.status }}</span>
                    </div> -->
                    <div class="text-center">
                        <NuxtLink :to="`/room/${room.room_id}`" class="mr-4">ดูเพิ่มเติม</NuxtLink>
                        <UButton label="จอง" @click="goToBooking(`/room/${room.room_id}/booking`)" size="xl" :ui="{ size: {xl: 'text-lg text-black'}, padding: { xl: 'px-4 py-1'} }"/>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="bg-white text-red-600 text-center text-xl p-4 mt-4 border-2 border-[#FFA800] ">
            ไม่พบรายการ
        </div>
    </div>
    
    <div class="bg-white py-4  "  v-if="rooms.length > 0">
        <UPagination
            v-model="page"
            :page-count="pageCount"
            :total="pageTotal"
            :ui="{
                wrapper: 'flex items-center justify-center gap-1',
                rounded: '!rounded-full min-w-[32px] justify-center',
                default: {
                    activeButton: {
                        variant: 'outline'
                    }
                }
            }"
    />
    </div>
</template>


<script setup>

    import moment from 'moment'

    definePageMeta({
        title: 'ความรู้มุ่งสู่ความสำเร็จ',
        middleware: 'auth'
    })


    useSeoMeta({
        title: 'จองห้องประชุม'
    })

    onMounted(() => {
    });

    const nameSearch = ref('')
    const capacitySearch = ref(null)
    const buildingSearch = ref('')
    const statusSearch = ref('')

    const dateNow = moment(new Date()).format('YYYY-MM-DDTHH:mm:00.000')

    const searchDateBegin = ref(dateNow)
    const searchDateEnd = ref(dateNow)


    const config = useRuntimeConfig()
    const labelStartDate = computed(() => searchDateBegin.value ? moment(searchDateBegin.value).format('DD/MM/YYYY เวลา HH:mm') : 'เลือกวันที่เริ่มจอง')
    const labelEndDate = computed(() => searchDateEnd.value ?  moment(searchDateEnd.value).format('DD/MM/YYYY เวลา HH:mm') : 'เลือกวันที่สิ้นสุด')


    const stateDateStart = useState('stateDateStart')
    const stateDateEnd = useState('stateDateEnd')


    const goToBooking = async (url) => {

        stateDateStart.value = searchDateBegin.value
        stateDateEnd.value = searchDateEnd.value
        await navigateTo(url)
    }
   
    
    const isValidDateRange = computed(() => {
        if (searchDateBegin.value && searchDateEnd.value ) {
            return moment(searchDateBegin.value).isSameOrBefore(moment(searchDateEnd.value ));
        }
        return true;
    });

         // Pagination
    const page = ref(1)
    const pageCount = ref(12)

     // Data
    const { data: rooms, pending, refresh } = await useAsyncData('rooms', async () => await listRooms({
        RoomName: nameSearch.value,
        Capacity: capacitySearch.value || null,
        Building: buildingSearch.value,
        Status: statusSearch.value,
        DateBegin: searchDateBegin.value,
        DateEnd: searchDateEnd.value
       })
    , {
        default: () => [],
        watch: [nameSearch, capacitySearch, buildingSearch, statusSearch, searchDateBegin, searchDateEnd]
    })

    const rowRooms = computed(() => rooms.value.slice((page - 1) * pageCount, (page) * pageCount))
   
    const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
    const pageTotal = computed(() => rooms.value.length )
    const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

    const resetSearch = () =>{
        nameSearch.value = ''
        capacitySearch.value = null
        buildingSearch.value = ''
        statusSearch.value = ''
        searchDateBegin.value = dateNow
        searchDateEnd.value= dateNow
    }
   
</script>



<style lang="scss">

</style>