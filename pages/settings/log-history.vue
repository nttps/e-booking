<template>
    <div>

        <UTabs :items="items" class="w-full">
            <template #login-log="{ item }">
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
                            ประวัติการเข้าสู่ระบบ
                        </h2>
                    </template>
                    <div class="flex justify-between items-center w-full mb-4">
                        <!-- Filters -->
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-1.5">
                                <UInput v-model="nameSearch" placeholder="ผู้ทำรายการ" />
                            </div>
                            <div class="flex items-center gap-1.5">
                                <label for="">วันที่</label>
                                <UPopover :popper="{ placement: 'bottom-start' }">
                                    <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="md" :label="labelLoginStartDate" />
                                    <template #panel="{ close }">
                                        <FormDatePicker v-model="loginSearchDateStart" @close="close"/>
                                    </template>
                                </UPopover>
                                <div v-if="!isValidDateRange" class="text-red-500 text-sm">
                                    *วันที่เริ่มต้องไม่เกินวันที่สิ้นสุด
                                </div>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <label for="">ถึงวันที่</label>
                                <UPopover :popper="{ placement: 'bottom-start' }">
                                    <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="md" :label="labelLoginEndDate" />
                                    <template #panel="{ close }">
                                        <FormDatePicker v-model="loginSearchDateEnd" :min-date="loginSearchDateStart" @close="close"/>
                                    </template>
                                </UPopover>
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
                                :disabled="loginSearchDateStart === null && loginSearchDateEnd === null && nameSearch === ''"
                                @click="resetFilters"
                            >
                                ล้างค่าการค้นหา
                            </UButton>
                        </div>
                    </div>
                    
                    <!-- Table -->
                <!-- Table -->
                <UTable
                
                    :rows="loginLog.slice((page - 1) * pageCount, (page) * pageCount)"
                    :columns="columns"
                    :loading="pendingLog"
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
                                :total="loginLog.length"
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

            </template>

            <template #history-log="{ item }">
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
                            ประวัติกิจกรรม
                        </h2>
                    </template>
                    <div class="flex justify-between items-center w-full mb-4">
                        <!-- Filters -->
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-1.5">
                                <label for="">วันที่</label>
                                <UPopover :popper="{ placement: 'bottom-start' }">
                                    <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="md" :label="labelActivityStartDate" :disabled="view" />
                                    <template #panel="{ close }">
                                        <FormDatePicker v-model="activitySearchDateStart" @close="close" :date-time="true" />
                                    </template>
                                </UPopover>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <label for="">ถึงวันที่</label>
                                <UPopover :popper="{ placement: 'bottom-start' }">
                                    <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="md" :label="labelActivityEndDate" :disabled="view" />
                                    <template #panel="{ close }">
                                        <FormDatePicker v-model="activitySearchDateEnd" @close="close" :date-time="true" />
                                    </template>
                                </UPopover>
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
                                :disabled="activitySearchDateStart === null && activitySearchDateEnd === null"
                                @click="resetActivityFilters"
                            >
                                ล้างค่าการค้นหา
                            </UButton>
                        </div>
                    </div>
                    
                    <!-- Table -->
                <!-- Table -->
                <UTable
                
                    :rows="activityLog.slice((pageActivity - 1) * pageActivityCount, (pageActivity) * pageActivityCount)"
                    :columns="activityColumns"
                    :loading="pendingActi"
                    class="w-full"
                    :loading-state="{ label: 'กำลังโหลด ...' }" 
                    :empty-state="{ label: 'ไม่พบรายการ' }"
                >

                    <template #id-data="{ row , index}">
                        {{ pageActivityFrom + index }}
                    </template>

                    <template #createdDate-data="{ row }">
                        {{ moment(row.createdDate).format('DD/MM/YYYY เวลา HH:mm') }}
                    </template>

                </UTable>


                    <!-- Number of rows & Pagination -->
                    <template #footer>
                        <div class="flex flex-wrap justify-between items-center">
                            <div>
                                <span class="text-sm leading-5">
                                    Showing
                                    <span class="font-medium">{{ pageActivityFrom }}</span>
                                    to
                                    <span class="font-medium">{{ pageActivityTo }}</span>
                                    of
                                    <span class="font-medium">{{ pageActivityTotal }}</span>
                                    results
                                </span>
                            </div>

                            <UPagination
                                v-model="page"
                                :page-count="pageCount"
                                :total="activityLog.length"
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

            </template>

        </UTabs>
        
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


    const items = [{
        slot: 'login-log',
        label: 'ประวัติการเข้าสู่ระบบ'
    }, {
        slot: 'history-log',
        label: 'ประวัติกิจกรรม'
    }]
   

    const nameSearch = ref('')
    const loginSearchDateStart = ref(moment().subtract(3, 'months').format('YYYY-MM-DD'))
    const loginSearchDateEnd = ref(moment().format('YYYY-MM-DD'))
    const labelLoginStartDate = computed(() => moment(loginSearchDateStart.value).format('DD/MM/YYYY'))
    const labelLoginEndDate = computed(() => moment(loginSearchDateEnd.value).format('DD/MM/YYYY'))


    const activitySearchDateStart = ref(moment().subtract(3, 'months').format('YYYY-MM-DD'))
    const activitySearchDateEnd = ref(moment().format('YYYY-MM-DD'))
    const labelActivityStartDate = computed(() => moment(activitySearchDateStart.value).format('DD/MM/YYYY'))
    const labelActivityEndDate = computed(() => moment(activitySearchDateEnd.value).format('DD/MM/YYYY'))


     const isValidDateRange = computed(() => {
        if (loginSearchDateStart.value && loginSearchDateEnd.value) {
            return moment(loginSearchDateStart.value).isSameOrBefore(moment(loginSearchDateEnd.value));
        }
        return true;
    });


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

    const activityColumns = [{
        key: 'id',
        label: 'ลำดับ',
    }, {
        key: 'action',
        label: 'กิจกรรม',
    }, {
        key: 'createdBy',
        label: 'โดย',
    }, {
        key: 'createdDate',
        label: 'วันที่',
    }]
  
    onMounted(async ()=> {
  

    })

    const resetFilters = () => {
        nameSearch.value = ''
        loginSearchDateStart .value = moment().subtract(3, 'months').format('YYYY-MM-DD')
        loginSearchDateEnd.value = moment().format('YYYY-MM-DD')
    }

    const resetActivityFilters = () => {
        activitySearchDateStart .value = moment().subtract(3, 'months').format('YYYY-MM-DD')
        activitySearchDateEnd.value = moment().format('YYYY-MM-DD')
    }
    // Pagination
    const page = ref(1)
    const pageCount = ref(10)
    const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
    const pageTotal = computed(() => loginLog.value.length )
    const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

    // Data
    const { data: loginLog, pending: pendingLog, refresh: refreshLog } = await useAsyncData('loginLog', async () => await postApi('/AppsLogin/ListLoginLog' , {
            User: nameSearch.value,
            App:"MEETING",//DPM-ADMIN ,DX ,EDP ,E-FIRE ,E-LEARNING ,E-MACHINE, HELP DESK ,MEETING ,PM-RAIN ,SURVEY,TODAY
            Begin: loginSearchDateStart.value,
            End: loginSearchDateEnd.value
        }) 
    , {
        default: () => [],
        watch: [page, pageFrom, pageCount, nameSearch, loginSearchDateStart, loginSearchDateEnd]
    })


     // Pagination
    const pageActivity = ref(1)
    const pageActivityCount = ref(10)
    const pageActivityFrom = computed(() => (pageActivity.value - 1) * pageActivityCount.value + 1)
    const pageActivityTotal = computed(() => activityLog.value.length )
    const pageActivityTo = computed(() => Math.min(pageActivity.value * pageActivityCount.value, pageActivityTotal.value))


    const { data: activityLog, pending: pendingActi, refresh } = await useAsyncData('activityLog', async () => await postApi('/bk/book/ListLog' , {
            date_begin: activitySearchDateStart.value,
            date_end: activitySearchDateEnd.value
        }) 
    , {
        default: () => [],
        watch: [page, pageFrom, pageCount, activitySearchDateStart, activitySearchDateEnd]
    })



</script>

<style lang="scss" scoped>

</style>