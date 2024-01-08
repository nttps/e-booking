<template>
    <div>
        <div class="text-3xl font-bold mb-4">รายการจองทั้งหมด</div>
        <div class="flex justify-between items-center w-full mb-4">
            <!-- Filters -->
            <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="ชื่อห้องประชุม" size="xl" />
                </div>
                <div class="flex items-center gap-1.5">
                    <UInput v-model="attendeeSearch" placeholder="จำนวนผู้เข้าประชุม" size="xl" />
                </div>
                <div class="flex items-center gap-1.5">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                        <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="xl" :label="labelStartDate" />
                        <template #panel="{ close }">
                            <FormDatePicker v-model="searchDateBegin" @close="close" />
                        </template>
                    </UPopover>
                </div>
                <div class="flex items-center gap-1.5">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                        <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="xl" :label="labelEndDate" />
                        <template #panel="{ close }">
                            <FormDatePicker v-model="searchDateEnd" @close="close"/>
                        </template>
                    </UPopover>
                </div>
                <div class="flex items-center gap-1.5">
                    <UInput v-model="buildingSearch" placeholder="อาคาร" size="xl" />
                </div>
                <div class="flex items-center gap-1.5">
                    <USelect :options="['ทั้งหมด', 'รออนุมัติ', 'อนุมัติ', 'ปฏิเสธ']" v-model="statusSearch" placeholder="สถานะ" size="xl" />
                </div>
                <div class="flex items-center gap-1.5" v-if="authStore.isAdmin">
                    <UCheckbox color="primary" 
                        :value="true" 
                        label="แสดงรายการจองเฉพาะของคุณ"
                        class="mb-2" 
                        :ui="{container: 'flex items-center h-6', base: 'h-5 w-5 text-lg dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-current dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent'}"
                        @change="checkSearch"
                    />
                </div>
            </div>
            
            <div class="flex gap-1.5 items-center">
                <UButton
                    color="gray"
                    size="xl"
                    :disabled="nameSearch === '' && attendeeSearch === null && searchDateBegin === null && searchDateEnd === null && statusSearch === ''"
                    @click="resetFilters"
                >
                    ล้างค่าการค้นหา
                </UButton>
            </div>
        </div>
        
        <!-- Table -->
        <UTable
        
            :rows="booking"
            :columns="columns"
            :loading="pending"
            class="w-full"
            :loading-state="{ label: 'กำลังโหลด ...' }" 
            :empty-state="{ label: 'ไม่พบรายการ' }"
        >


            <template #detail-data="{ row }">
                <NuxtLink to="">รายละเอียด </NuxtLink>
            </template>

            <template #bk_date-data="{ row }">
                {{ moment(row.bk_date).format('DD/MM/YYYY') }}
            </template>

            <template #date_begin-data="{ row }">
                {{ moment(row.date_begin).format('DD/MM/YYYY เวลา HH:mm') }}
            </template>

            <template #date_end-data="{ row }">
               {{ moment(row.date_end).format('DD/MM/YYYY เวลา HH:mm') }}
            </template>


            <template #status-data="{ row }">
               
            </template>
            <template #actions-data="{ row }">
                <div class="flex items-center">
                    <div v-if="row.status === 'รออนุมัติ'" class="flex items-center">
                        <UButton  
                            label="อนุมัติ"
                            color="emerald"
                            square
                            @click="approve(row.bk_no)" 
                        />
                        <UButton  
                            icon="i-heroicons-pencil-solid"
                            color="emerald"
                            square
                            variant="link" 
                            class=" self-center"
                            @click="edit(row.bk_no)" 
                        />
                    </div>

                    <div v-if="row.status !== 'อนุมัติ'">
                        <UButton  
                            icon="i-heroicons-trash-solid"
                            color="red"
                            square
                            variant="link" 
                            @click="modalDelete = true; dataDelete = row.bk_no"
                        />
                    </div>
                    <div v-else>

                        <UButton  
                            label="รายละเอียด"
                            @click="edit(row.bk_no, true)"
                        />
                    </div>
                </div>
            
            </template>
            
        </UTable>
        <div class="flex flex-wrap justify-between items-center bg-white px-4 pb-4 pt-4">
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

    <UModal v-model="modalEdit" :ui="{ width: 'sm:max-w-6xl'}">
        <UForm :state="form" @submit="submit">

            <FormBooking :form="form" :auth="authStore" :items="items" :room="form.roomname" :view="view" /> 
        </UForm>
        
    </UModal>

    <ModalAlertDelete v-model="modalDelete" @confirm="deleteItem"/>
    <UModal v-model="modalConfirm" :ui="{ width: 'sm:max-w-6xl'}" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="text-center">ยืนยันการจอง</div>
            </template>

            <div class="font-bold text-xl text-center">คุณต้องการยืนยันการจองนี้ใช่หรือไม่</div>

            <template #footer>
                <div class="flex justify-between">
                    <button type="button" class="px-4 py-2 bg-green-600 text-base rounded-[5px] text-white" @click="submitConfirm">ยืนยัน</button>
                    <button type="button" class="px-4 py-2 bg-gray-500 text-base rounded-[5px] text-white" @click="modalConfirm = false">ยกเลิก</button>
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script setup>
    import moment from 'moment'

    const authStore = useAuthStore()

    const modalEdit = ref(false)
    const modalConfirm = ref(false)
    const nameSearch = ref('')

    const nameUserSearch = ref('')
    const attendeeSearch = ref(null)
    const buildingSearch = ref('')
    const statusSearch = ref('')


    const typeSearch = ref("")

    const searchDateBegin = ref(null)
    const searchDateEnd = ref(null)


    const modalDelete = ref(false)
    const dataDelete = ref(null)

    const labelStartDate = computed(() => searchDateBegin.value ? moment(searchDateBegin.value).format('DD/MM/YYYY') : 'เลือกวันที่เริ่ม')
    const labelEndDate = computed(() => searchDateEnd.value ?  moment(searchDateEnd.value).format('DD/MM/YYYY') : 'เลือกวันที่สิ้นสุด')


    const checkSearch = (e) => {
        const { checked } = e.target

        if(checked) {
            nameUserSearch.value = authStore.username
        }else {
            nameUserSearch.value = ''
        }
    }
    // Columns
    const columns = [{
        key: 'bk_no',
        label: 'เลขที่เอกสาร',
    }, {
        key: 'room_name',
        label: 'ห้องประชุม',
    }, {
        key: 'bk_date',
        label: 'วันที่จอง',
    }, {
        key: 'date_begin',
        label: 'ตั้งแต่',
    }, {
        key: 'date_end',
        label: 'ถึง',
    }, {
        key: 'agenda',
        label: 'หัวข้อการประชุม',
    }, {
        key: 'reason_desc',
        label: 'รายละเอียด',
    }, {
        key: 'status',
        label: 'สถานะ',
    }, {
        key: 'actions',
        label: 'จัดการ',
    }]

    const resetFilters = () => {
        nameSearch.value = ""
        searchDateBegin.value = null
        searchDateEnd.value = null
        attendeeSearch.value = null
        buildingSearch.value = ""
        statusSearch.value = ""

    }
     // Pagination
    const page = ref(1)
    const pageCount = ref(10)
    const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
    const pageTotal = computed(() => booking.value.length )
    const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

    // Data
    const { data: booking, pending, refresh } = await useAsyncData('booking', async () => await postApi('/bk/book/ListData' , {
            OwnerUsername: nameUserSearch.value,
            date_begin: searchDateBegin.value,
            date_end: searchDateEnd.value,
            Type: "จองห้องประชุม",
            Status: statusSearch.value === 'ทั้งหมด' ? '' : statusSearch.value,
            RoomName: nameSearch.value,
            Attendee: attendeeSearch.value,
            Building: buildingSearch.value

        }) 
    , {
        default: () => [],
        watch: [page, pageFrom, pageCount, nameUserSearch, nameSearch, statusSearch, buildingSearch, attendeeSearch, searchDateBegin , searchDateEnd]
    })

    const form = ref({})
    const items = ref([])
    const view = ref(false)

    const itemJoin = computed(() => items.value.join(',')) 


    const edit = async (id, viewS = false) => {
        const data = await getApi(`/bk/book/GetDocSet?bk_id=${id}`)

        form.value = data.booking
        form.value.joiners = data.joiners

        items.value = data.booking.remark2.split(',');
        modalEdit.value = true 
        view.value = viewS
    }

     
    const deleteItem = async () => {
        const data = await deleteApi('/bk/book/DeleteDoc' , {
            bkNO: dataDelete.value,//รหัส staff
            ActionBy: authStore.username//current user login
        })

        modalDelete.value = false
        refresh()
    }

    const submit = async ()  => {
       modalConfirm.value = true
    }

    const submitConfirm = async ()  => {

        form.value.remark2 = itemJoin.value
        const data = await postApi('/bk/book/save' , {
            booking: form.value,
            joiners: form.value.joiners.map(joiner => {
                return {username: joiner.username, join_role: joiner.join_role }
            })
        })


        await navigateTo('/booking-list')
    }
</script>

<style lang="scss" scoped>

</style>