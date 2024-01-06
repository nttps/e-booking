<template>
    <div>
        <div class="text-3xl font-bold mb-4">รายการจองทั้งหมด</div>
        <div class="flex justify-between items-center w-full mb-4">
            <!-- Filters -->
            <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="ชื่อห้องประชุม" />
                </div>
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="ตำนวนผู้เข้าประชุม" />
                </div>
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="วันที่เริ่ม" />
                </div>
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="วันที่สิ้นสุด" />
                </div>
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="อาคาร" />
                </div>
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="สถานะ" />
                </div>
            </div>
            
            <div class="flex gap-1.5 items-center">
                <UButton
                    icon="i-heroicons-magnifying-glass"
                    color="gray"
                    size="xs"
                    trailing
                >
                    ค้นหา
                </UButton>
                <UButton
                    color="gray"
                    size="xs"
                    :disabled="nameSearch === '' && typeSearch === ''"
                    @click="resetFilters"
                >
                    ล้างค่าการค้นหา
                </UButton>
                <UButton label="เพิ่มข้อมูล" color="amber" @click="modalAdd = true; getOtherItems()"/>
            </div>
        </div>
        
        <!-- Table -->
        <UTable
        
            :rows="booking.stations"
            :columns="columns"
            :loading="pending"
            class="w-full"
            :ui="{ td: { base: 'max-w-[0] truncate' } }"
            :loading-state="{ label: 'กำลังโหลด ...' }" 
            :empty-state="{ label: 'ไม่พบรายการ' }"
        >


            <template #detail-data="{ row }">
                <NuxtLink to="">รายละเอียด </NuxtLink>
            </template>

            <template #date_begin-data="{ row }">
                {{ moment(row.date_begin).format('DD/MM/YYYY เวลา HH:mm') }}
            </template>

            <template #date_end-data="{ row }">
               {{ moment(row.date_end).format('DD/MM/YYYY เวลา HH:mm') }}
            </template>


            <template #status-data="{ row }">
               
            </template>
        </UTable>
        <div class="flex flex-wrap justify-between items-center bg-white px-4 pb-4">
            <div>
                <span class="text-sm leading-5">
                    Showing
                    <span class="font-medium">{{ pageFrom }}</span>
                    to
                    <span class="font-medium">{{ pageTo }}</span>
                    of
                    <span class="font-medium">{{ pageTotal }}</span>
                    results
                </span>
            </div>

            <UPagination
                v-model="page"
                :page-count="pageCount"
                :total="booking.length"
                :ui="{
                    wrapper: 'flex items-center gap-1',
                    rounded: '!rounded-full min-w-[32px] justify-center',
                    default: {
                        activeButton: {
                            variant: 'outline'
                        }
                    }
                }"
            />
        </div>
    </div>
</template>

<script setup>
  import moment from 'moment'

    const authStore = useAuthStore()

    const modalAdd = ref(false)
    const nameSearch = ref("")
    const typeSearch = ref("")


    // Columns
    const columns = [{
        key: 'id',
        label: 'เลขที่เอกสาร',
    }, {
        key: 'station_name',
        label: 'ห้องประชุม',
    }, {
        key: 'date_begin',
        label: 'ตั้งแต่',
    }, {
        key: 'date_end',
        label: 'ถึง',
    }, {
        key: 'count_other_machine',
        label: 'หัวข้อการประชุม',
    }, {
        key: 'modified_by',
        label: 'รายละเอยีด',
    }, {
        key: 'status',
        label: 'สถานะ',
    }]

    const resetFilters = () => {
        nameSearch.value = ""
    }
     // Pagination
    const page = ref(1)
    const pageCount = ref(10)
    const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
    const pageTotal = computed(() => booking.value.length )
    const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

    // Data
    const { data: booking, pending, refresh } = await useAsyncData('booking', async () => await postApi('/bk/book/ListData' , {
            OwnerUsername: nameSearch.value,
            date_begin: null,
            date_end: null,
            Type: "จองห้องประชุม",
            Status: ""
        }) 
    , {
        default: () => [],
        watch: [page, pageFrom, pageCount, nameSearch, typeSearch]
    })

</script>

<style lang="scss" scoped>

</style>