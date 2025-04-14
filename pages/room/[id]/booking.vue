<template>
    <div>
        <div class="text-4xl font-bold mb-4">
            {{ room.room_name }}
        </div>

        <UForm :state="form" :schema="schema" @submit="submit">

            <FormBooking :form="form" :auth="auth" :items="items" :room="room" v-if="room" :files="files" :loading="loading" /> 

            <UModal v-model="modalConfirm" :ui="{ width: 'sm:max-w-6xl'}" prevent-close>
                <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                    <template #header>
                        <div class="text-center">ยืนยันการจอง</div>
                    </template>

                    <div class="font-bold text-xl text-center">คุณต้องการยืนยันการจองนี้ใช่หรือไม่</div>

                    <template #footer>
                        <div class="flex justify-between">
                            <UButton label="ยืนยัน" color="green" class="px-4 py-2 text-base rounded-[5px] text-white" :loading="loading" @click="submitConfirm" />
                            <button type="button" class="px-4 py-2 bg-gray-500 text-base rounded-[5px] text-white" @click="modalConfirm = false">ยกเลิก</button>
                        </div>
                    </template>
                </UCard>
            </UModal>
        </UForm>
    </div>

    
</template>

<script setup>
    import moment from "moment"
    import { object, string } from "yup"
    const route = useRoute()


    const schema = object({
        date_begin: string().required('กรุณาเลือกวันที่'),
        date_end: string()
            .required('กรุณาเลือกวันที่')
    })

    const loading = ref(false)
    const auth = useAuthStore()
    const dateNow = ref(moment(new Date()))
    
    const modalConfirm = ref(false)
    
    const items = ref([])
    const files = ref([])
    const itemJoin = computed(() => items.value.join(',')) 

    const room = ref(null)
    const data = await getApi(`/bk/room/GetDocSet?room_id=${route.params.id}`)

    const stateDateStart = ref()
    const stateDateEnd = ref()


    room.value = data.rooms
    room.value.facilities = data.facilities
    onMounted(() => {
        fetchSupports()

    })
    const form = ref({
        bk_no:"",//กรณีเพิ่มใหม่ไม่ต้องส่งค่ามา แต่ถ้าเป็นการแก้ไขให้เลขเอกสารมา
        bk_date: dateNow.value.format('YYYY-MM-DDTHH:mm:ss.000'),//วันที่จอง
        reason_id:"",//รหัสเหตุผลเชื่อมกับตาราง bk_type(REASON)
        reason_desc:"",//เหตุผลในการจอง
        room_id: '',
        bk_type:"จองห้องประชุม",//จองห้องประชุม, จองยานพาหนะ ,จองพนักงานขับรถ
        bk_by_username: auth.username,//จองด้วยชื่อยูสเซอร์
        bk_by_fullname: auth.fullName, //จองด้วยชื่อเต็ม
        bk_for_dep_id:"",//จำนวนเอกสารแนบ 
        remark1:"",//จุดหมายปลายทาง
        remark2: itemJoin.value,//สัมภาระ
        remark3:"",//หมายเหตุุ
        is_need_driver:true,//ต้องการพนักงานขับรถ 
        count_file:1,//
        num_attendee: 0,//จำนวนผู้เข้าร่วม   
        num_observer: 0,//
        agenda:"",//รายละเอียดการประชุม
        date_begin: null,//วันเวลาที่จอง
        date_end: null,// ถึงวันที่ 
        time_begin: null,//วันเวลาที่จอง
        time_end: null,// ถึงวันที่ 
        created_by: auth.username, //ผู้ทำรายการ
        modified_by:"",//ผู้แก้ไขรายการ
        joiners: [],
        staff: []
    })

    const fetchSupports = async () => {
        const resObject = await getApi('/bk/type/ListBookFacilitiesSelect') 

        form.value.staff = resObject
    }


    const submit = async ()  => {
       modalConfirm.value = true
    }

     const submitConfirm = async ()  => {

        const booking = {
            ...form.value,
            date_begin: moment(form.value.date_begin + ' ' + form.value.time_begin).format('YYYY-MM-DDTHH:mm:ss.000'),
            date_end: moment(form.value.date_end + ' ' + form.value.time_end).format('YYYY-MM-DDTHH:mm:ss.000'),
        }
        delete booking.time_begin
        delete booking.time_end
        loading.value = true
        form.value.room_id = room.value.room_id
        const data = await postApi('/bk/book/save' , {
            booking: booking,
            joiners: form.value.joiners.map(joiner => {
                return {username: joiner.username, join_role: joiner.join_role }
            }),
            staff: form.value.staff
        })

        if(files.value.length > 0) {
            await uploadFile(data.booking.bk_no)
        }else {
            await navigateTo('/booking-list')
        }

        
    }

    const uploadFile = async (id)  => {

        var formdata = new FormData();
        files.value.forEach(image => {
            formdata.append("files", image.file);
        })

        const data = await imageUpload(`/bk/book/UploadBookDocs?book_id=${id}&created_by=${auth.username}` , formdata )
        await navigateTo('/booking-list')

    }

    

</script>

<style lang="scss" scoped>

</style>