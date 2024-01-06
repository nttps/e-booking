<template>
    <div>
        <div class="text-4xl font-bold mb-4">
            {{ room.room_name }}
        </div>

        <UForm :state="form" @submit="submit">

            <FormBooking :form="form" :auth="auth" :items="items" :room="room" /> 
        </UForm>


    </div>
</template>

<script setup>
    import moment from "moment"
    const route = useRoute()

    const auth = useAuthStore()
    const dateNow = ref(moment(new Date()))

    
    const items = ref([])
    const itemJoin = computed(() => items.value.join(',')) 

    const room = ref({})

     onMounted(() => {
        fetchData()
    })
    const fetchData = async () => {
        const data = await getApi(`/bk/room/GetDocSet?room_id=${route.params.id}`)
        room.value = data.rooms
    }

    const form = ref({
        bk_no:"",//กรณีเพิ่มใหม่ไม่ต้องส่งค่ามา แต่ถ้าเป็นการแก้ไขให้เลขเอกสารมา
        bk_date: dateNow.value.format('YYYY-MM-DDTHH:mm:ss.000'),//วันที่จอง
        reason_id:"",//รหัสเหตุผลเชื่อมกับตาราง bk_type(REASON)
        reason_desc:"",//เหตุผลในการจอง
        bk_type:"จองห้องประชุม",//จองห้องประชุม, จองยานพาหนะ ,จองพนักงานขับรถ
        bk_by_username: auth.username,//จองด้วยชื่อยูสเซอร์
        bk_by_fullname: auth.fullName, //จองด้วยชื่อเต็ม
        bk_for_dep_id:"",//จำนวนเอกสารแนบ 
        remark1:"",//จุดหมายปลายทาง
        remark2: itemJoin.value,//สัมภาระ
        remark3:"",//หมายเหตุุ
        is_need_driver:true,//ต้องการพนักงานขับรถ 
        count_file:1,//
        num_attendee: null,//จำนวนผู้เข้าร่วม   
        agenda:"",//รายละเอียดการประชุม
        date_begin: moment(dateNow.value).format('YYYY-MM-DDTHH:mm'),//วันเวลาที่จอง
        date_end: moment(dateNow.value).format('YYYY-MM-DDTHH:mm'),// ถึงวันที่ 
        created_by: auth.username, //ผู้ทำรายการ
        modified_by:"",//ผู้แก้ไขรายการ
        joiners: []
    })

    const submit = async ()  => {

        form.value.remark2 = itemJoin.value
        const data = await postApi('/bk/book/save' , {
            booking: form.value,
            joiners: []
        })
    }

</script>

<style lang="scss" scoped>

</style>