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
                    รายการจองห้องประชุม
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
                    <UButton label="เพิ่มรายการจอง" color="amber" @click="modalAdd = true;"/>
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

                <template #id-data="{ row, index }">
                    {{ pageFrom + index }}
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

    <UModal v-model="modalAdd" :ui="{ width: 'sm:max-w-6xl'}" @close="closeModal" :prevent-close="preventClose">
       <UForm :state="form" @submit="submit">

            <FormBooking :form="form" :auth="authStore" :items="items" :room="room" :view="view"  @approve="approve" /> 
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
        
    </UModal>

    <ModalAlertDelete v-model="modalDelete" @confirm="deleteItem"/>
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
   
    const authStore = useAuthStore()

    const modalAdd = ref(false)
    const modalDelete = ref(false)

    const dataDelete = ref(null)

    const nameSearch = ref("")
    const typeSearch = ref("")
    const view = ref(false)


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


    const closeModal = () => {
        form.value = {
            bk_no:"",//กรณีเพิ่มใหม่ไม่ต้องส่งค่ามา แต่ถ้าเป็นการแก้ไขให้เลขเอกสารมา
            bk_date: dateNow.value.format('YYYY-MM-DDTHH:mm:ss.000'),//วันที่จอง
            reason_id:"",//รหัสเหตุผลเชื่อมกับตาราง bk_type(REASON)
            reason_desc:"",//เหตุผลในการจอง
            bk_type:"จองห้องประชุม",//จองห้องประชุม, จองยานพาหนะ ,จองพนักงานขับรถ
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
    }

    
    const dateNow = ref(moment(new Date()))

    const room = ref({})
    const dataForm = {
        bk_no:"",//กรณีเพิ่มใหม่ไม่ต้องส่งค่ามา แต่ถ้าเป็นการแก้ไขให้เลขเอกสารมา
        bk_date: dateNow.value.format('YYYY-MM-DDTHH:mm:ss.000'),//วันที่จอง
        reason_id:"",//รหัสเหตุผลเชื่อมกับตาราง bk_type(REASON)
        reason_desc:"",//เหตุผลในการจอง
        bk_type:"จองห้องประชุม",//จองห้องประชุม, จองยานพาหนะ ,จองพนักงานขับรถ
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
        modalAdd.value = true
        view.value = viewS
    }
    



    const submit = async ()  => {
        const data = await postApi('/bk/book/save' , {
            booking: form.value,
            joiners: []
        })
    }
 
    const deleteItem = async () => {
        const data = await deleteApi('/fr/FireStation/DeleteDoc' , {
            StationID: dataDelete.value,//รหัส staff
            DeletedBy: authStore.username//current user login
        })

        modalDelete.value = false
        refresh()
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
        refresh()
    }
    

</script>

<style lang="scss" scoped>

</style>