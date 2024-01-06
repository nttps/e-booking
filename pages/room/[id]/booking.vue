<template>
    <div>
        <div class="text-4xl font-bold mb-4">
            {{ room.room_name }}
        </div>

        <UForm :state="form" @submit="submit">

            <div class="bg-white rounded-md py-2 px-4">
                <div class="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
                    <div class="text-xl font-bold">รายละเอียดเอกสารการจองห้อง</div>
                    <div>
                        <UButton type="submit" label="ยืนยัน" size="xl" :ui="{ size: {xl: 'text-lg text-black'}, padding: { xl: 'px-4 py-1'} }"/>
                    </div>
                </div>
                <div class="mb-4">
                    <table class="border-separate border-spacing-x-2 ">
                        <tr>
                            <td>เลขที่เอกสาร</td>
                            <td class=" text-zinc-400">AUTO</td>
                        </tr>
                        <tr>
                            <td>วันที่ขอ</td>
                            <td class="text-zinc-400">{{ dateNow.format('DD-MM-YYYY') }}</td>
                        </tr>
                        <tr>
                            <td>เจ้าหน้าที่ทำรายการ</td>
                            <td class="text-zinc-400">{{ auth.user.currentUserInfo.fullName}}</td>
                        </tr>
                    </table>
                </div>
                <div class="border-b-2 border-black pb-2 mb-4">
                    <div class="text-xl font-bold">รายละเอียดพนักงาน</div>
                </div>
                <div class="mb-4 px-2">
                    <div class="flex justify-between">
                        <div class="w-1/2">
                            <table class="border-separate border-spacing-x-2 ">
                                <tr>
                                    <td>รหัสพนักงาน</td>
                                    <td class=" text-zinc-400">{{ auth.user.currentUserInfo.fullName}}</td>
                                </tr>
                                <tr>
                                    <td>สำนัก</td>
                                    <td class="text-zinc-400">{{ auth.user.currentUserInfo.positionID}}</td>
                                </tr>
                                <tr>
                                    <td>ประเภทงาน</td>
                                    <td class="text-zinc-400">{{ auth.user.currentUserInfo.positionID}}</td>
                                </tr>
                                <tr>
                                    <td>เบอร์ติดต่อ</td>
                                    <td class="text-zinc-400">{{ auth.user.currentUserInfo.tel || '-' }}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="w-1/2">
                            <table class="border-separate border-spacing-x-2 ">
                                <tr>
                                    <td>ชื่อ - นามสกุล</td>
                                    <td class=" text-zinc-400">{{ auth.user.currentUserInfo.fullName}}</td>
                                </tr>
                                <tr>
                                    <td>ฝ่าย</td>
                                    <td class="text-zinc-400">{{  auth.user.currentUserInfo.fullName }}</td>
                                </tr>
                                <tr>
                                    <td>ตำแหน่ง</td>
                                    <td class="text-zinc-400">{{ auth.user.currentUserInfo.positionID}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="border-b-2 border-black pb-2">
                    <div class="text-xl font-bold">รายละเอียดห้องประชุม</div>
                </div>
                <div class="mb-4">
                    <div class="flex justify-between">
                        <table class="border-separate border-spacing-2 w-full">
                            <tr>
                                <td class="w-1/6">วันที่ - เวลาเริ่มการประชุม</td>
                                <td class="w-5/6 text-zinc-400">
                                    <UPopover :popper="{ placement: 'bottom-start' }">
                                        <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="md" :label="labelStartDate" />
                                        <template #panel="{ close }">
                                            <FormDatePicker v-model="form.date_begin" @close="close" :date-time="true" />
                                        </template>
                                    </UPopover>
                                </td>
                            </tr>
                            <tr>
                                <td>วันที่ - เวลาสิ้นสุดการประชุม</td>
                                <td class="text-zinc-400">
                                    <UPopover :popper="{ placement: 'bottom-start' }">
                                        <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="md" :label="labelEndDate" />
                                        <template #panel="{ close }">
                                            <FormDatePicker v-model="form.date_end" @close="close" :date-time="true"/>
                                        </template>
                                    </UPopover>
                                </td>
                            </tr>
                            <tr>
                                <td>ห้องประชุม</td>
                                <td class="text-zinc-400">{{ room.room_name }}</td>
                            </tr>
                            <tr>
                                <td>หัวข้อการประชุม</td>
                                <td class="text-zinc-400">
                                    <div class="relative w-full min-w-[200px]">
                                        <input
                                        v-model="form.agenda"
                                        required
                                        class="peer h-full w-full border-b border-zinc-400 bg-transparent outline py-1 outline-0 transition-all focus:border-black focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>วัตถุประสงค์</td>
                                <td class="text-zinc-400">
                                    <USelectMenu :options="objectives" v-model="form.reason_desc"  
                                        placeholder="เลือกวัตถุประสงค์" 
                                        value-attribute="type_name" 
                                        option-attribute="type_name" 
                                        required
                                    />
                                    
                                </td>
                            </tr>
                            <tr>
                                <td>จำนวนผู้เข้าประชุม</td>
                                <td class="text-zinc-400">
                                    <div class="relative w-full min-w-[200px]">
                                        <input
                                            v-model.number="form.num_attendee"
                                            type="number"
                                            required
                                            class="peer h-full w-full border-b border-zinc-400 bg-transparent outline py-1 outline-0 transition-all focus:border-black focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                        />
                                    </div>
                                </td>
                            </tr> 
                            <tr>
                                <td>หมายเหตุ</td>
                                <td class="text-zinc-400">
                                    <div class="relative w-full min-w-[200px]">
                                        <input
                                            v-model="form.remark3"
                                            class="peer h-full w-full border-b border-zinc-400 bg-transparent outline py-1 outline-0 transition-all focus:border-black focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" 
                                        />
                                    </div>
                                </td>
                            </tr> 
                            <tr>
                                <td>อุปกรณ์ที่ต้องการ</td>
                                <td class="text-zinc-400">
                                    <div class="flex space-x-4 mt-2">
                                        <div>
                                            <UCheckbox color="primary" label="เจ้าหน้าที่ IT" class="mb-2" :ui="{container: 'flex items-center h-6', base: 'h-5 w-5 dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-current dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent'}"/>
                                            <UCheckbox color="primary" label="ระบบ ICT" class="mb-2" :ui="{container: 'flex items-center h-6', base: 'h-5 w-5 dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-current dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent'}"/>
                                        </div>
                                        <div>
                                            <UCheckbox color="primary" label="ระบบ E-Meeting" class="mb-2" :ui="{container: 'flex items-center h-6', base: 'h-5 w-5 dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-current dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent'}"/>

                                            <UCheckbox color="primary" label="ชุดเครื่องดื่ม" class="mb-2" :ui="{container: 'flex items-center h-6', base: 'h-5 w-5 dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-current dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent'}"/>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>อื่น ๆ</td>
                                <td class="text-zinc-400">
                                    <div class="relative w-full min-w-[200px]">
                                        <input
                                        v-model="form.remark2"
                                        class="peer h-full w-full border-b border-zinc-400 bg-transparent outline py-1 outline-0 transition-all focus:border-black focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>ผู้เข้าร่วมประชุม</td>
                                <td class="text-zinc-400">
                                    <div class="flex space-x-2">
                                        <div class="w-1/4">
                                            <USelectMenu
                                                placeholder="เลือกผู้เข้าร่วมประชุม" 
                                                v-model="joiner.username"
                                                value-attribute="type_name" 
                                                option-attribute="type_name" 
                                                :searchable="searchUser"
                                                searchable-placeholder="ค้นหาผู้เข้าร่วม"

                                                required
                                            />
                                        </div>
                                        <div class="w-1/4">
                                            <USelectMenu
                                                placeholder="เลือกตำแหน่งที่ประชุม" 
                                                v-model="joiner.position"
                                                :searchable="searchPosition"
                                                searchable-placeholder="ค้นหาตำแหน่ง"
                                                value-attribute="label" 
                                                option-attribute="label" 

                                                required
                                            />

                                        </div>
                                        <div>
                                            <UButton 
                                                label="เพิ่มผู้เข้าร่วม" 
                                                color="amber" 
                                                @click="addJoiners" 
                                                class=" disabled:bg-slate-300" 
                                                :disabled="!joiner.username"
                                            />
                                        </div>
                                    </div>
                                    
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td class="text-zinc-400">
                                    <UTable 
                                        :rows="form.joiners.slice((pagejoiner - 1) * pagejoinerCount, (pagejoiner) * pagejoinerCount)"
                                        :columns="joinerColumns"
                                        :empty-state="{ label: 'ผู้เข้าร่วม' }"
                                        :loading-state="{ label: 'กำลังโหลด...' }"
                                        :ui="{
                                            th: {
                                                color: 'text-gray-900 dark:text-white',
                                                base: 'text-left rtl:text-right bg-white',
                                                size: 'text-sm'
                                            }
                                        }"
                                        
                                        
                                    >


                                    </UTable>
                                    <UPagination
                                        v-model="pagejoiner"
                                        :page-count="pagejoinerCount"
                                        :total="pagejoinerTotal"
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
                                    
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

            </div>

        </UForm>
    </div>
</template>

<script setup>
    import moment from "moment"
    const config = useRuntimeConfig();

    const route = useRoute()
    const auth = useAuthStore()

    const objectives = ref([])
    const positions = ref([])

    onMounted(() => {
        fetchData()
        fetchType()
    })

    const dateNow = ref(moment(new Date()))

    const room = ref({})

    const joiner = ref({
        username: null,
        position: null
    })
    const fetchData = async () => {
        const data = await getApi(`/bk/room/GetDocSet?room_id=${route.params.id}`)
        room.value = data.rooms
    }

    const fetchType = async () => {
        const resObject = postApi('/bk/type/ListData' , {
            TypeKey: "OBJECTIVE",
            SearchText: '',
        }) 

      
        objectives.value = resObject
    }

    const joinerColumns = [{
            key: 'id',
            label: 'ลำดับ',
        }, {
            key: 'name',
            label: 'ชื่อ - นามสกุล',
        }, {
            key: 'actions',
            label: 'ตำแหน่งบริหาร',
        }, {
            key: 'actions',
            label: 'ตำแหน่งที่ประชุม',
        }, {
            key: 'actions',
            label: 'จัดการข้อมูล',
        }
    ]

    const labelStartDate = computed(() => moment(form.value.date_begin).format('DD/MM/YYYY เวลา HH:mm'))
    const labelEndDate = computed(() => moment(form.value.date_end).format('DD/MM/YYYY เวลา HH:mm'))

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
        remark2:"",//สัมภาระ
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

      // Pagination
    const pagejoiner = ref(1)
    const pagejoinerCount = ref(10)
    const pagejoinerTotal = computed(() => form.value.joiners.length) // This value should be dynamic coming from the API
    const pagejoinerFrom = computed(() => (pagejoiner.value - 1) * pagejoinerCount.value + 1)
    const pagejoinerTo = computed(() => Math.min(pagejoiner.value * pagejoinerCount.value, pagejoinerTotal.value))


    const searchUser = async (q) => {
        const users = []

        return users.map(user => ({ id: user.username, label: user.fullName, positionID: user.positionID })).filter(Boolean)
    }

    const searchPosition = async (q) => {
        const positions = await postApi('/bk/type/ListData' , {
            TypeKey: "POSITION",
            SearchText: q,
        }) 

        console.log(positions);
        return positions.map(user => ({ id: user.type_id, label: user.type_name })).filter(Boolean)
    }
    const addJoiners = () => {

    }

    const submit = async ()  => {
        const data = await postApi('/bk/book/save' , {
            booking: form.value,
            joiners: []
        })
    }

</script>

<style lang="scss" scoped>

</style>