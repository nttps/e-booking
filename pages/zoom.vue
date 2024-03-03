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
                    รายการจองระบบ ZOOM
                </h2>
            </template>
           <div class="bg-white py-4 border-2 border-[#FFA800] rounded-md mb-4">
            <!-- Filters -->
                <div class="flex items-center justify-center gap-3 mb-2">
                    <div class="flex items-center">
                        <UInput v-model="agedaSearch" placeholder="ชื่อหัวข้อประชุม" size="xl" />
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
                            v-model="showMeOnly"
                            label="แสดงรายการจองเฉพาะของคุณ"
                            class="mb-2" 
                            :ui="{container: 'flex items-center h-6', base: 'h-5 w-5 text-lg dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-current dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent'}"
                            @change="checkSearch"
                        />
                    </div>
                   
                </div>

                <div class="flex items-center justify-center gap-3">
                    <div class="flex items-center">
                        <USelect :options="['ทั้งหมด', 'รออนุมัติ', 'อนุมัติ', 'ปฏิเสธ']" v-model="statusSearch" placeholder="สถานะ" size="xl" />
                    </div>
                   
                     <div class="flex items-center">
                        <UButton
                            color="gray"
                            size="xl"
                            :disabled="agedaSearch === '' && attendeeSearch === null && searchDateBegin === null && searchDateEnd === null && statusSearch === ''"
                            @click="resetFilters"
                        >
                            ล้างค่าการค้นหา
                        </UButton>
                    </div>
                </div>
           
        </div>
            <div class="text-right mb-2">
                <UButton label="เพิ่มรายการจอง" color="amber" @click="modalAdd = true;"/>
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
                    <div class="text-center">
                         <UDropdown :items="actionItems(row)" :popper="{ placement: 'bottom-start' }">
                            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                        </UDropdown>
                    </div>
                 
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

    <UModal v-model="modalAdd" :ui="{ width: 'sm:max-w-6xl'}" :prevent-close="preventClose" @close="closeModal">
        <UForm :state="form" @submit="submit">

            <FormZoom :form="form" :auth="authStore" :items="items" :room="form.roomname" :view="view" @approve="approve" :files="files"/> 
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
                            <button type="button" class="px-4 py-2 bg-gray-500 text-base rounded-[5px] text-white" @click="modalConfirmApprove = false;preventClose = false; closeModal()">ยกเลิก</button>
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
                        <UButton type="button" color="green" class="px-4 py-2 text-base rounded-[5px] text-white" @click="submitConfirm" :loading="loading">ยืนยัน</UButton>
                        <button type="button" class="px-4 py-2 bg-gray-500 text-base rounded-[5px] text-white" @click="modalConfirm = false">ยกเลิก</button>
                    </div>
                </template>
            </UCard>
        </UModal>
        
    </UModal>
    <UModal v-model="modalCancle" :ui="{ width: 'sm:max-w-6xl'}" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="text-center">ยืนยันรายการ</div>
            </template>

            <div class="font-bold text-xl text-center">คุณต้องการยกเลิกการจองนี้ใช่หรือไม่</div>

            <template #footer>
                <div class="flex justify-between">
                    <button type="button" class="px-4 py-2 bg-green-600 text-base rounded-[5px] text-white" @click="submitApprove">ยืนยัน</button>
                    <button type="button" class="px-4 py-2 bg-gray-500 text-base rounded-[5px] text-white" @click="modalCancle = false">ยกเลิก</button>
                </div>
            </template>
        </UCard>
    </UModal>
     

    <ModalAlertDelete v-model="modalDelete" @confirm="deleteItem"/>
   
</template>

<script setup>  
    import moment from 'moment'

    useSeoMeta({
        title: 'จองห้องระบบ Zoom'
    })
    const authStore = useAuthStore()

    const modalAdd = ref(false)
    const modalDelete = ref(false)
    const modalCancle = ref(false)
    const dataDelete = ref(null)
    const nameUserSearch = ref(authStore.username)
    const showMeOnly = ref(false)
    const view = ref(false)
    const modalConfirm = ref(false)
    const searchDateBegin = ref(null)
    const searchDateEnd = ref(null)
    const attendeeSearch = ref(null)
    const statusSearch = ref('')
    const agedaSearch = ref('')

    const labelStartDate = computed(() => searchDateBegin.value ? moment(searchDateBegin.value).format('DD/MM/YYYY') : 'เลือกวันที่เริ่ม')
    const labelEndDate = computed(() => searchDateEnd.value ?  moment(searchDateEnd.value).format('DD/MM/YYYY') : 'เลือกวันที่สิ้นสุด')


    // Columns
    const columns = [{
        key: 'bk_no',
        label: 'เลขที่เอกสาร',
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
        label: '',
    }]
  
    const actionItems = (row) => {

        let btn = [{
            label: 'รายละเอียด',
            icon: 'i-heroicons-eye-20-solid',
            click: () => edit(row.bk_no, true)
        }]

        if(row.status !== 'ปฏิเสธ') {
            btn.push({
                label: 'แก้ไข',
                icon: 'i-heroicons-pencil-solid',
                click: () => edit(row.bk_no)
            })
        }

        if(row.status !== 'ปฏิเสธ' && row.status !== 'ยกเลิก') {
            btn.push({
                label: 'ยกเลิก',
                icon: 'i-heroicons-x-circle',
                click: () => modalConfirmCancle(row.bk_no)
            })
        }

        if(row.status !== 'อนุมัติ') {
            btn.push({
                label: 'ลบ',
                icon: 'i-heroicons-trash-solid',
                click: () => deleteConfirm(row.bk_no)
            })
        }
    
       
        return [btn]
    }


    onMounted(async ()=> {
  

    })

    const checkSearch = (e) => {
        const { checked } = e.target

        if(checked) {
            nameUserSearch.value = authStore.username
        }else {
            nameUserSearch.value = ''
        }
    }

    const resetFilters = () => {
        searchDateBegin.value = null
        searchDateEnd.value = null
        attendeeSearch.value = null
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
            Type: "ZOOM",
            Status: statusSearch.value === 'ทั้งหมด' ? '' : statusSearch.value,
            RoomName: '',
            Attendee: attendeeSearch.value || null,
            Building: '',
            Agenda: agedaSearch.value,
            IsShowMeOnly: showMeOnly.value
        }) 
    , {
        default: () => [],
         watch: [page, pageFrom, pageCount, nameUserSearch, statusSearch, attendeeSearch, searchDateBegin , searchDateEnd, agedaSearch,showMeOnly]
    })


    const closeModal = () => {
        form.value = {
            bk_no:"",//กรณีเพิ่มใหม่ไม่ต้องส่งค่ามา แต่ถ้าเป็นการแก้ไขให้เลขเอกสารมา
            bk_date: dateNow.value.format('YYYY-MM-DDTHH:mm:ss.000'),//วันที่จอง
            reason_id:"",//รหัสเหตุผลเชื่อมกับตาราง bk_type(REASON)
            reason_desc:"",//เหตุผลในการจอง
            bk_type:"ZOOM",//จองระบบ ZOOM, จองยานพาหนะ ,จองพนักงานขับรถ
            bk_by_username: authStore.username,//จองด้วยชื่อยูสเซอร์
            bk_by_fullname: authStore.fullName, //จองด้วยชื่อเต็ม
            bk_for_dep_id:"",//จำนวนเอกสารแนบ 
            remark1:"",//จุดหมายปลายทาง
            remark2:"",//สัมภาระ
            remark3:"",//หมายเหตุุ
            is_need_driver:true,//ต้องการพนักงานขับรถ 
            count_file:1,//
            num_attendee: null,//จำนวนผู้เข้าร่วม   
            agenda:"",//รายละเอียดการประชุม
            date_begin: moment(dateNow.value).format('YYYY-MM-DDTHH:mm'),//วันเวลาที่จอง
            date_end: moment(dateNow.value).format('YYYY-MM-DDTHH:mm'),// ถึงวันที่ 
            created_by: authStore.username, //ผู้ทำรายการ
            modified_by:"",//ผู้แก้ไขรายการ
            joiners: []
        }

        view.value = false
        items.value = []
    }

    
    const dateNow = ref(moment(new Date()))

    const room = ref({})

    const files = ref([])


    const dataForm = {
        bk_no:"",//กรณีเพิ่มใหม่ไม่ต้องส่งค่ามา แต่ถ้าเป็นการแก้ไขให้เลขเอกสารมา
        bk_date: dateNow.value.format('YYYY-MM-DDTHH:mm:ss.000'),//วันที่จอง
        reason_id:"",//รหัสเหตุผลเชื่อมกับตาราง bk_type(REASON)
        reason_desc:"",//เหตุผลในการจอง
        bk_type:"ZOOM",//จองระบบ ZOOM, จองยานพาหนะ ,จองพนักงานขับรถ
        bk_by_username: authStore.username,//จองด้วยชื่อยูสเซอร์
        bk_by_fullname: authStore.fullName, //จองด้วยชื่อเต็ม
        bk_for_dep_id:"",//จำนวนเอกสารแนบ 
        remark1:"",//จุดหมายปลายทาง
        remark2:"",//สัมภาระ
        remark3:"",//หมายเหตุุ
        is_need_driver:true,//ต้องการพนักงานขับรถ 
        count_file:1,//
        num_attendee: null,//จำนวนผู้เข้าร่วม   
        agenda:"",//รายละเอียดการประชุม
        date_begin: moment(dateNow.value).format('YYYY-MM-DDTHH:mm'),//วันเวลาที่จอง
        date_end: moment(dateNow.value).format('YYYY-MM-DDTHH:mm'),// ถึงวันที่ 
        created_by: authStore.username, //ผู้ทำรายการ
        modified_by:"",//ผู้แก้ไขรายการ
        joiners: []
    }

    const form = ref(dataForm)
    const items = ref([])

    

    const itemJoin = computed(() => items.value.join(',')) 

    const dataApprove = ref({
        bkNO:"",  
        Action:"",//สถานะมี 2 สถานะคือ  (อนุมัติ , ปฏิเสธ)
        ActionBy: authStore.username,//อนุมัติหรือปฏิเสธโดย
        Reason:""//เหตุผลการไม่อนุมัติ ถ้าอนุมัติไม่ต้องใส่
    })

    const edit = async (id, viewS = false) => {
        dataApprove.value.bkNO = id
        const data = await getApi(`/bk/book/GetDocSet?bk_id=${id}`)

        form.value = data.booking
        form.value.joiners = data.joiners

        items.value = data.booking.remark2.split(',');
        files.value = data.docs
        modalAdd.value = true 
        view.value = viewS
    }

     
    const deleteConfirm = (id) => {
        modalDelete.value = true; 
        dataDelete.value = id
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



    const uploadFile = async (id)  => {

        var formdata = new FormData();
        files.value.forEach(image => {
            formdata.append("files", image.file);
        })

        const data = await imageUpload(`/bk/book/UploadBookDocs?book_id=${id}&created_by=${authStore.username}` , formdata )

        closeModal()
        refresh()

    }

    const loading = ref(false)
    const submitConfirm = async ()  => {

        loading.value = true
        const data = await postApi('/bk/book/save' , {
            booking: form.value,
            joiners: form.value.joiners.map(joiner => {
                return {username: joiner.username, join_role: joiner.join_role }
            }),
            staff: []
        })
        if(files.value.length > 0) {
            uploadFile(data.booking.bk_no)
        }else {
            closeModal()
            refresh()

        }

        modalConfirm.value = false
        modalAdd.value = false
        loading.value = false
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
        modalAdd.value = false
        modalCancle.value = false
        refresh()

    }
    


    const modalConfirmCancle = (id) => {
        modalCancle.value = true
        dataApprove.value.bkNO = id
        dataApprove.value.Action = 'ยกเลิก'
    }
</script>

<style lang="scss" scoped>

</style>