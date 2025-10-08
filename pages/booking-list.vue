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
                    <div class="self-center">
                        <UCheckbox color="primary" 
                            :value="true" 
                            v-model="showMeOnly"

                            label="แสดงรายการจองเฉพาะของคุณ"
                            class="my-2" 
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
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" rowspan="2" class="px-3 py-3.5 text-center bg-[#FFA800] text-sm font-semibold text-gray-900 border-r border-gray-200">เลขที่เอกสาร</th>
                            <th scope="col" rowspan="2" class="px-3 py-3.5 text-center bg-[#FFA800] text-sm font-semibold text-gray-900 border-r border-gray-200">ห้องประชุม</th>
                            <th scope="col" rowspan="2" class="px-3 py-3.5 text-center bg-[#FFA800] text-sm font-semibold text-gray-900 border-r border-gray-200">วันที่จอง</th>
                            <th scope="col" colspan="2" class="px-3 py-2 text-center bg-[#FFA800] text-sm font-semibold text-gray-900 border-b border-r border-gray-200">วัน/เวลาที่ประชุม</th>
                            <th scope="col" rowspan="2" class="px-3 py-3.5 text-center bg-[#FFA800] text-sm font-semibold text-gray-900 border-r border-gray-200">หัวข้อการประชุม</th>
                            <th scope="col" rowspan="2" class="px-3 py-3.5 text-center bg-[#FFA800] text-sm font-semibold text-gray-900 border-r border-gray-200">วัตถุประสงค์</th>
                            <th scope="col" rowspan="2" class="px-3 py-3.5 text-center bg-[#FFA800] text-sm font-semibold text-gray-900 border-r border-gray-200">หน่วยงานผู้จองห้อง</th>
                            <th scope="col" rowspan="2" class="px-3 py-3.5 text-center bg-[#FFA800] text-sm font-semibold text-gray-900 border-r border-gray-200">สถานะ</th>
                            <th scope="col" rowspan="2" class="px-3 py-3.5 text-center bg-[#FFA800] text-sm font-semibold text-gray-900">รายละเอียด</th>
                        </tr>
                        <tr>
                            <th scope="col" class="px-3 py-2 text-center text-sm font-semibold bg-[#FFA800] text-gray-900  border-r border-gray-200">ตั้งแต่</th>
                            <th scope="col" class="px-3 py-2 text-center text-sm font-semibold  bg-[#FFA800] text-gray-900 border-r border-gray-200">ถึง</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        <tr v-if="pending">
                            <td colspan="10" class="px-3 py-12 text-center text-sm text-gray-500">
                                <div class="flex justify-center items-center">
                                    <svg class="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span class="ml-2">กำลังโหลด ...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="booking.length === 0">
                            <td colspan="10" class="px-3 py-12 text-center text-sm text-gray-500">
                                ไม่พบรายการ
                            </td>
                        </tr>
                        <tr v-else v-for="row in booking.slice((page - 1) * pageCount, (page) * pageCount)" :key="row.bk_no" class="hover:bg-gray-50">
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 border border-gray-200">{{ row.bk_no }}</td>
                            <td class="px-3 py-4 text-sm text-gray-900 whitespace-normal border border-gray-200">{{ row.room_name }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 border border-gray-200">{{ moment(row.bk_date).format('DD/MM/YYYY') }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center border border-gray-200">{{ moment(row.date_begin).format('DD/MM/YYYY เวลา HH:mm') }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center border border-gray-200">{{ moment(row.date_end).format('DD/MM/YYYY เวลา HH:mm') }}</td>
                            <td class="px-3 py-4 text-sm text-gray-900 whitespace-normal border border-gray-200">{{ row.agenda }}</td>
                            <td class="px-3 py-4 text-sm text-gray-900 whitespace-normal border border-gray-200">{{ row.reason_desc }}</td>
                            <td class="px-3 py-4 text-sm text-gray-900 border border-gray-200">{{ row.bk_by_dep_id }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 border border-gray-200">{{ row.status }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center border border-gray-200">
                                <UDropdown :items="actionItems(row)" :popper="{ placement: 'bottom-start' }">
                                    <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                                </UDropdown>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
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
                            <UButton type="submit" color="red" label="ตกลง" class="px-4 py-2 bg-red-600 text-base rounded-[5px] text-white" :loading="loading" />
                            <button type="button" class="px-4 py-2 bg-gray-500 text-base rounded-[5px] text-white" @click="modalConfirmApprove = false;preventClose = false">ยกเลิก</button>
                        </div>
                    </template>
                </UCard>
            </UForm>
        </UModal>

    <UModal v-model="modalEdit" :ui="{ width: 'sm:max-w-6xl'}" :prevent-close="preventClose">
        <UForm :state="form" @submit="submit">
            <div class="flex justify-end">
                <div>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-circle" size="xl" @click="modalEdit = false"/>
                </div>
            </div>
            <FormBooking :form="form" :auth="authStore" :items="items" :room="room" :view="view" @approve="approve" :files="files" /> 
        </UForm>

      
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
    
    <UModal v-model="modalCancle" :ui="{ width: 'sm:max-w-6xl'}" prevent-close>
        <UForm :state="dataApprove" @submit="submitApprove">
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="text-center">ยืนยันรายการ</div>
            </template>

            <div class="font-bold text-xl text-center">คุณต้องการยกเลิกการจองนี้ใช่หรือไม่</div>

            <UFormGroup label="กรอกเหตุผล" name="Reason" size="xl">
                <UTextarea v-model="dataApprove.Reason" placeholder="" ref="reason" required/>
            </UFormGroup>

            <template #footer>
                <div class="flex justify-between">
                    <UButton type="submit" color="green" class="px-4 py-2 bg-green-600 text-base rounded-[5px] text-white">ยืนยัน</UButton>
                    <UButton type="button" color="gray" class="px-4 py-2 bg-gray-500 text-base rounded-[5px] text-white" @click="modalCancle = false">ยกเลิก</UButton>
                </div>
            </template>
        </UCard>
        </UForm>
    </UModal>
     
    
</template>

<script setup>
    import moment from 'moment'

    useSeoMeta({
        title: 'รายการจองห้องประชุม'
    })
    const authStore = useAuthStore()

    const modalEdit = ref(false)
    const modalConfirm = ref(false)
    const nameSearch = ref('ทั้งหมด')

    const nameUserSearch = ref(authStore.username)
    const attendeeSearch = ref(null)
    const buildingSearch = ref('')
    const statusSearch = ref('')
    const agedaSearch = ref('')
    const modalCancle = ref(false)

    const params = computed(() => useRoute().query)


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


    const showMeOnly = ref(false)
    onMounted(() => {
        fetchRooms()
        
    })

    watch(() => params.value, () => {
        console.log(params.value.notification)
        if (params.value.notification) {
            edit(params.value.notification, true)
        }
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
    },{
        key: 'department_id',
        label: 'หน่วยงานผู้จองห้อง',
    }, {
        key: 'status',
        label: 'สถานะ',
    }, {
        key: 'actions',
        label: '',
    }]

    const actionItems = (row) => {

        let btn = [{
            label: 'รายละเอียด',
            icon: 'i-heroicons-eye-20-solid',
            click: () => edit(row.bk_no, true)
        }]

        if(row.status !== 'ปฏิเสธ' && row.status !== 'อนุมัติ') {
            btn.push({
                label: 'แก้ไข',
                icon: 'i-heroicons-pencil-square-20-solid',
                click: () => edit(row.bk_no)
            })
        }

    
        if(row.status !== 'อนุมัติ') {
            btn.push({
                label: 'ลบ',
                icon: 'i-heroicons-trash-solid',
                click: () => deleteConfirm(row.bk_no)
            })
        }

        const btnApprove = []

        if(row.status !== 'ปฏิเสธ' && row.status !== 'อนุมัติ') {
            btnApprove.push({
                label: 'อนุมัติ',
                icon: 'i-heroicons-check-circle-20-solid',
                click: () => approve(row.bk_no, true)
            },{
                label: 'ปฏิเสธ',
                icon: 'i-heroicons-x-circle-20-solid',
                click: () => approve(row.bk_no, false)
            })
        }

        if(row.status !== 'ยกเลิก') {
            btnApprove.push({
                label: 'ยกเลิก',
                icon: 'i-heroicons-x-circle',
                click: () => modalConfirmCancle(row.bk_no)
            })
        }
        return [btn, btnApprove]
    }

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

    const departmentUser = ref(authStore.user.currentUserInfo.departmentID)
    const { data: booking, pending, refresh } = await useAsyncData('booking', async () => {
        return await postApi('/bk/book/ListData' , {
            OwnerUsername: nameUserSearch.value,
            date_begin: searchDateBegin.value,
            date_end: searchDateEnd.value,
            Type: "จองห้องประชุม",
            Status: statusSearch.value === 'ทั้งหมด' ? '' : statusSearch.value,
            RoomName: nameSearch.value  === 'ทั้งหมด' ? '' : nameSearch.value,
            Attendee: attendeeSearch.value,
            Building: buildingSearch.value,
            Agenda:agedaSearch.value,
            IsShowMeOnly: showMeOnly.value,

        }) 
    }
    , {
        default: () => [],
        watch: [page, pageFrom, pageCount, nameUserSearch, nameSearch, statusSearch, buildingSearch, attendeeSearch, searchDateBegin , searchDateEnd, agedaSearch, showMeOnly, departmentUser]
    })

    const form = ref({})
    const items = ref([])
    const view = ref(false)
    const files = ref([])

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
        files.value = data.docs
        form.value.time_begin = moment(form.value.date_begin).format('HH:mm')
        form.value.time_end = moment(form.value.date_end).format('HH:mm')
        
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

        if(files.value.length > 0) {
            await uploadFile(data.booking.bk_no)
        }else {
             refresh()
        }


        modalConfirm.value = false
        modalEdit.value = false


    }

    const deleteConfirm = (id) => {
        modalDelete.value = true; 
        dataDelete.value = id
    }
    const uploadFile = async (id)  => {

        var formdata = new FormData();
        files.value.forEach(image => {
            formdata.append("files", image.file);
        })

        const data = await imageUpload(`/bk/book/UploadBookDocs?book_id=${id}&created_by=${authStore.username}` , formdata )

        refresh()

    }

    const modalConfirmApprove = ref(false)
    const preventClose = ref(false)

    const approve = async (id, status) => {
        dataApprove.value.bkNO = id
        preventClose.value = true
        await nextTick()
        dataApprove.value.Action = status ? "อนุมัติ" : "ปฏิเสธ"

        modalConfirmApprove.value = true
    }


    const loading = ref(false)
    const submitApprove = async () => {

        loading.value = true
        const res = await postApi('/bk/book/UpdateStatus', dataApprove.value)

        modalConfirmApprove.value = false
        preventClose.value = false
        modalEdit.value = false
        modalCancle.value = false
        refresh()

        loading.value = false
    }
    const modalConfirmCancle = (id) => {
        modalCancle.value = true
        dataApprove.value.bkNO = id
        dataApprove.value.Action = 'ยกเลิก'
    }
</script>

<style lang="scss" scoped>

</style>