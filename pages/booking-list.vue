<template>
    <div>
        <div class="text-3xl font-bold mb-4">รายการจองทั้งหมด</div>
        <div class="bg-white py-4 border-2 border-[#FFA800] rounded-md mb-4">
            <!-- Filters -->
                <div class="flex items-center justify-center gap-3 mb-2">
                    <div class="flex items-center">
                        <UInput v-model="agedaSearch" placeholder="ชื่อหัวข้อประชุม" size="xl" />
                    </div>
                    <div class="flex items-center w-[200px]">
                        <USelectMenu value-attribute="room_name" class="w-full" option-attribute="room_name" :options="rooms" v-model="nameSearch" searchable placeholder="ห้องประชุม" size="xl" />
                    </div>
                    <div class="flex items-center">
                        <UInput v-model="attendeeSearch" placeholder="จำนวนผู้เข้าร่วม" size="xl" />
                    </div>
                    <div class="flex items-center">
                        <UPopover :popper="{ placement: 'bottom-start' }">
                            <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="xl" :label="labelStartDate" />
                            <template #panel="{ close }">
                                <FormDatePicker v-model="searchDateBegin" @close="close" />
                            </template>
                        </UPopover>
                    </div>
                    <div class="flex items-center">
                        <UPopover :popper="{ placement: 'bottom-start' }">
                            <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="xl" :label="labelEndDate" />
                            <template #panel="{ close }">
                                <FormDatePicker v-model="searchDateEnd" @close="close"/>
                            </template>
                        </UPopover>
                    </div>
                    <div class="flex items-center" v-if="authStore.isAdmin">
                        <UCheckbox color="primary" 
                            :value="true" 
                            :model-value="nameUserSearch !== ''" 

                            label="แสดงรายการจองเฉพาะของคุณ"
                            class="mb-2" 
                            :ui="{container: 'flex items-center h-6', base: 'h-5 w-5 text-lg dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-current dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent'}"
                            @change="checkSearch"
                        />
                    </div>
                   
                </div>

                <div class="flex items-center justify-center gap-3">
                    <div class="flex items-center">
                        <UInput v-model="buildingSearch" placeholder="อาคาร" size="xl" />
                    </div>
                    <div class="flex items-center">
                        <USelect :options="['ทั้งหมด', 'รออนุมัติ', 'อนุมัติ', 'ปฏิเสธ']" v-model="statusSearch" placeholder="สถานะ" size="xl" />
                    </div>
                   
                     <div class="flex items-center">
                        <UButton
                            color="gray"
                            size="xl"
                            :disabled="agedaSearch === '' && nameSearch === '' && attendeeSearch === null && searchDateBegin === null && searchDateEnd === null && statusSearch === ''"
                            @click="resetFilters"
                        >
                            ล้างค่าการค้นหา
                        </UButton>
                    </div>
                </div>
           
        </div>
        
        <!-- Table -->
        <UTable
        
            :rows="booking.slice((page - 1) * pageCount, (page) * pageCount)"
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
                    <UButton  
                        icon="i-heroicons-eye-20-solid"
                        square
                        variant="link" 
                        class=" self-center"
                        @click="edit(row.bk_no, true)" 
                    />
                    <div v-if="row.status === 'รออนุมัติ'" class="flex items-center">
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

    <UModal v-model="modalEdit" :ui="{ width: 'sm:max-w-6xl'}" :prevent-close="preventClose">
        <UForm :state="form" @submit="submit">

            <FormBooking :form="form" :auth="authStore" :items="items" :room="room" :view="view" @approve="approve"/> 
        </UForm>

        <UModal v-model="modalConfirmApprove" prevent-close @close="preventClose = false">
            <UForm :state="dataApprove" @submit="submitApprove">
                <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                    <template #header>
                        <div class="text-center">แจ้งเตือนการยืนยัน</div>
                    </template>

                    <div class="font-bold text-xl text-center" v-if="dataApprove.Action === 'อนุมัติ'">อนุมัติรายการจองนี้ใช่หรือไม่</div>

                    <div v-else>
                        
                        <div class="text-red-600 font-bold text-xl text-center">ไม่อนุมัติรายการจองนี้ใช่หรือไม่</div>
                        <UFormGroup label="กรอกเหตุผล" name="Reason" size="xl">
                            <UTextarea v-model="dataApprove.Reason" placeholder="" ref="reason" required/>
                        </UFormGroup>
                    </div>


                    <template #footer>
                        <div class="flex justify-between">
                            <button type="submit" class="px-4 py-2 bg-red-600 text-base rounded-[5px] text-white">ตกลง</button>
                            <button type="button" class="px-4 py-2 bg-gray-500 text-base rounded-[5px] text-white" @click="modalConfirmApprove = false;preventClose = false">ยกเลิก</button>
                        </div>
                    </template>
                </UCard>
            </UForm>
        </UModal>
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
        
    </UModal>

    <ModalAlertDelete v-model="modalDelete" @confirm="deleteItem"/>
    

    
</template>

<script setup>
    import moment from 'moment'

    const authStore = useAuthStore()

    const modalEdit = ref(false)
    const modalConfirm = ref(false)
    const nameSearch = ref('ทั้งหมด')

    const nameUserSearch = ref(authStore.username)
    const attendeeSearch = ref(null)
    const buildingSearch = ref('')
    const statusSearch = ref('')
    const agedaSearch = ref('')
    


    const reason = ref()

    const searchDateBegin = ref(null)
    const searchDateEnd = ref(null)


    const modalDelete = ref(false)
    const dataDelete = ref(null)

    const labelStartDate = computed(() => searchDateBegin.value ? moment(searchDateBegin.value).format('DD/MM/YYYY') : 'เลือกวันที่เริ่ม')
    const labelEndDate = computed(() => searchDateEnd.value ?  moment(searchDateEnd.value).format('DD/MM/YYYY') : 'เลือกวันที่สิ้นสุด')


    const rooms = ref([{
        room_name: 'ทั้งหมด'
    }])


    onMounted(() => {
        fetchRooms()
    })

    const fetchRooms = async () => {
        const resObject = await listRooms({ })

        rooms.value = rooms.value.concat(resObject)
    }
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
        nameSearch.value = "ทั้งหมด"
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
            RoomName: nameSearch.value  === 'ทั้งหมด' ? '' : nameSearch.value,
            Attendee: attendeeSearch.value,
            Building: buildingSearch.value,
            Agenda:agedaSearch.value

        }) 
    , {
        default: () => [],
        watch: [page, pageFrom, pageCount, nameUserSearch, nameSearch, statusSearch, buildingSearch, attendeeSearch, searchDateBegin , searchDateEnd, agedaSearch]
    })

    const form = ref({})
    const items = ref([])
    const view = ref(false)

    const itemJoin = computed(() => items.value.join(',')) 

    const dataApprove = ref({
        bkNO:"",  
        Action:"",//สถานะมี 2 สถานะคือ  (อนุมัติ , ปฏิเสธ)
        ActionBy: authStore.username,//อนุมัติหรือปฏิเสธโดย
        Reason:""//เหตุผลการไม่อนุมัติ ถ้าอนุมัติไม่ต้องใส่
    })

    const room = ref(null)
    const edit = async (id, viewS = false) => {
        dataApprove.value.bkNO = id
        const data = await getApi(`/bk/book/GetDocSet?bk_id=${id}`)

        const dataRoom = await getApi(`/bk/room/GetDocSet?room_id=${data.booking.room_id}`)


        form.value = data.booking
        form.value.joiners = data.joiners
        form.value.staff = data.staff


        
        room.value = dataRoom.rooms
        room.value.facilities = dataRoom.facilities



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
            }),
            staff: form.value.staff
        })


        refresh()

        modalConfirm.value = false
        modalEdit.value = false


    }

    const modalConfirmApprove = ref(false)
    const preventClose = ref(false)

    const approve = async (status) => {
        preventClose.value = true
        await nextTick()
        dataApprove.value.Action = status ? "อนุมัติ" : "ปฏิเสธ"

        modalConfirmApprove.value = true
    }

    const submitApprove = async () => {
        const res = await postApi('/bk/book/UpdateStatus', dataApprove.value)

        modalConfirmApprove.value = false
        preventClose.value = false
        modalEdit.value = false
        refresh()
    }
</script>

<style lang="scss" scoped>

</style>