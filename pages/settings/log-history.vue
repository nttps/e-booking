<template>
    <div>
        <UCard
            class="w-full"
            :ui="{
                base: '',
                ring: '',
                divide: 'divide-y divide-gray-200 dark:divide-gray-700',
                header: { padding: 'px-4' },
                footer: { padding: 'p-4' }
            }"
        >
            <template #header>
                <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                    รายการจองระบบ Zoom
                </h2>
            </template>
            <div class="flex justify-between items-center w-full mb-4">
                <!-- Filters -->
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-1.5">
                        <UInput v-model="nameSearch" placeholder="เลขที่เอกสาร" />
                    </div>
                    <div class="flex items-center gap-1.5">
                        <UInput v-model="nameSearch" placeholder="วันที่ขอ" />
                    </div>
                    <div class="flex items-center gap-1.5">
                        <UInput v-model="nameSearch" placeholder="ผู้ทำรายการ" />
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
                </div>
            </div>
            
            <!-- Table -->
           <!-- Table -->
        <UTable
        
            :rows="booking.slice((page - 1) * pageCount, (page) * pageCount)"
            :columns="columns"
            :loading="pending"
            class="w-full"
            :loading-state="{ label: 'กำลังโหลด ...' }" 
            :empty-state="{ label: 'ไม่พบรายการ' }"
        >

            <template #id-data="{ row , index}">
                {{ pageFrom + index }}
            </template>

            <template #loginTime-data="{ row }">
                {{ moment(row.loginTime).format('DD/MM/YYYY เวลา HH:mm') }}
            </template>

        </UTable>


            <!-- Number of rows & Pagination -->
            <template #footer>
                <div class="flex flex-wrap justify-between items-center">
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
            </template>
            
        </UCard>
    </div>

</template>

<script setup>  
    import moment from 'moment'

    definePageMeta({ 
        layout: 'settings', 
        title: 'การตั้งค่า', 
        key: {
            title: 'การตั้งค่าส่วนตัว',
            icon: "ic:round-settings"
        },
        middleware: 'auth'
    })
   

    const nameSearch = ref("")
    const typeSearch = ref("")

    // Columns
    const columns = [{
        key: 'id',
        label: 'ลำดับ',
    }, {
        key: 'username',
        label: 'ชื่อผู้ใช้งาน ( Username )',
    }, {
        key: 'loginTime',
        label: 'Login เมื่อ',
    }]
  
    onMounted(async ()=> {
  

    })

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
    const { data: booking, pending, refresh } = await useAsyncData('booking', async () => await postApi('/AppsLogin/ListLoginLog' , {
            User: nameSearch.value,
            App:"MEETING",//DPM-ADMIN ,DX ,EDP ,E-FIRE ,E-LEARNING ,E-MACHINE, HELP DESK ,MEETING ,PM-RAIN ,SURVEY,TODAY
            Begin:"2024-01-01",
            End:"2024-01-31"
        }) 
    , {
        default: () => [],
        watch: [page, pageFrom, pageCount, nameSearch, typeSearch]
    })


</script>

<style lang="scss" scoped>

</style>