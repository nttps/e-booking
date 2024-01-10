<template>
    <div class="bg-white rounded-md py-2 px-4">
        <div class="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
            <div class="text-xl font-bold">รายละเอียดเอกสารการจองห้อง</div>
         
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
                    <td class="text-zinc-400">{{ form.bk_by_fullname || auth.user.currentUserInfo.fullName}}</td>
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
                            <td class=" text-zinc-400">{{  form.bk_by_username || auth.user.currentUserInfo.fullName}}</td>
                        </tr>
                        <!-- <tr>
                            <td>สำนัก</td>
                            <td class="text-zinc-400">{{ auth.user.currentUserInfo.positionID}}</td>
                        </tr>
                        <tr>
                            <td>ประเภทงาน</td>
                            <td class="text-zinc-400">{{ auth.user.currentUserInfo.positionID}}</td>
                        </tr> -->
                        <tr>
                            <td>เบอร์ติดต่อ</td>
                            <td class="text-zinc-400">{{ auth.user.currentUserInfo.tel || '-' }}</td>
                        </tr>
                    </table>
                </div>
                <div class="w-1/2">
                    <table class="border-separate border-spacing-x-2 ">
                        <tr>
                            <td>ชื่อ - นามสกุล / ตำแหน่ง</td>
                            <td class=" text-zinc-400">{{ form.bk_by_fullname || auth.user.currentUserInfo.fullName}}</td>
                        </tr>
                        <!-- <tr>
                            <td>ฝ่าย</td>
                            <td class="text-zinc-400">{{  auth.user.currentUserInfo.fullName }}</td>
                        </tr>
                        <tr>
                            <td>ตำแหน่ง</td>
                            <td class="text-zinc-400">{{ auth.user.currentUserInfo.positionID}}</td>
                        </tr> -->
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
                                <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="md" :label="labelStartDate" :disabled="view" />
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
                                <UButton icon="i-heroicons-calendar-days-20-solid" color="gray"  class="w-full border-b border-zinc-400" size="md" :label="labelEndDate" :disabled="view"  />
                                <template #panel="{ close }">
                                    <FormDatePicker v-model="form.date_end" @close="close" :date-time="true"/>
                                </template>
                            </UPopover>
                        </td>
                    </tr>
                    <tr>
                        <td>ห้องประชุม</td>
                        <td class="text-zinc-400">{{ props.room.room_name ?? form.room_name }}</td>
                    </tr>
                    <tr>
                        <td>หัวข้อการประชุม</td>
                        <td class="text-zinc-400">
                            <div class="relative w-full min-w-[200px]">
                                <input
                                v-model="form.agenda"
                                 :disabled="view" 
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
                                 :disabled="view" 
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
                                     :disabled="view" 
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
                                     :disabled="view" 
                                    class="peer h-full w-full border-b border-zinc-400 bg-transparent outline py-1 outline-0 transition-all focus:border-black focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" 
                                />
                            </div>
                        </td>
                    </tr> 
                    <tr>
                        <td>สิ่งอำนวยความสะดวก</td>
                        <td class="text-zinc-400">
                            <div class="flex flex-wrap space-x-4 mt-2">
                                <div v-for="facilitie in room.facilities.filter(f => f.isSelect == true)">{{ facilitie.facility_name }}</div>
                               
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>การสนับสนุนเจ้าหน้าที่</td>
                        <td class="text-zinc-400">
                            <div class="flex space-x-4 mt-2 ">
                                <UCheckbox color="primary" 
                                    v-model="support.isSelect" 
                                    :label="support.facility_name" 
                                     :disabled="view" 
                                    class="mb-2" 
                                    :ui="{container: 'flex items-center h-6 ', base: 'h-5 w-5 dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-current dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent', label: ' text-base'}"
                                    v-for="support in form.staff"
                                />
                               
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>อื่น ๆ</td>
                        <td class="text-zinc-400">
                            <div class="relative w-full min-w-[200px]">
                                <input
                                v-model="form.remark1"
                                 :disabled="view" 
                                class="peer h-full w-full border-b border-zinc-400 bg-transparent outline py-1 outline-0 transition-all focus:border-black focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>ผู้เข้าร่วมประชุม</td>
                        <td class="text-zinc-400">
                            <div class="flex space-x-2"  v-if="!view">
                                <div class="w-1/4">
                                    <USelectMenu
                                        placeholder="เลือกผู้เข้าร่วมประชุม" 
                                        v-model="joiner.username"
                                        :searchable="searchUser"
                                        searchable-placeholder="ค้นหาผู้เข้าร่วม"
                                    />
                                </div>
                                <div class="w-1/4">
                                    <USelectMenu
                                        placeholder="เลือกตำแหน่งที่ประชุม" 
                                        v-model="joiner.role"
                                        :searchable="searchPosition"
                                        searchable-placeholder="ค้นหาตำแหน่ง"
                                        value-attribute="label" 
                                        option-attribute="label" 
                                    />

                                </div>
                                <div >
                                    <UButton 
                                        label="เพิ่มผู้เข้าร่วม" 
                                        color="amber" 
                                        @click="addJoiners" 
                                        class=" disabled:bg-slate-300" 
                                        :disabled="!joiner.username && !joiner.role"
                                    />
                                </div>
                            </div>
                            <div v-else class="text-lg text-black font-bold">ผู้เข้าร่วมประชุม</div>
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
                                        base: 'bg-white border border-[#FFA800]',
                                        size: 'text-sm'
                                    }
                                }"
                            >
                                <template #id-data="{ index }">
                                    {{index+1}}
                                </template>
                                <template #actions-data="{ index }">
                                    <div class="flex items-center space-x-4" v-if="!view">
                                        <div>
                                            <UButton label="ลบ" color="red" @click="deleteJoiner(index)"/>
                                        </div>
                                    </div>
                                    <div v-else></div>
                                </template>
                            </UTable>
                            <UPagination
                                v-model="pagejoiner"
                                :page-count="pagejoinerCount"
                                :total="pagejoinerTotal"
                                class="mt-2"
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
        <div v-if="!view" class="flex space-x-4 justify-center mb-6">
            <UButton  
                label="อนุมัติ"
                color="emerald"
                size="xl"
                @click="emit('approve', true)" 
                :ui="{ size: {xl: 'text-lg text-black'}, padding: { xl: 'px-4 py-1'} }"
                v-if="form.bk_no && canApprove"
            />
            <UButton  
                label="ไม่อนุมัติ"
                color="red"
                size="xl"
                @click="emit('approve', false)" 
                :ui="{ size: {xl: 'text-lg text-black'}, padding: { xl: 'px-4 py-1'} }"
                v-if="form.bk_no && canApprove"
            />
            
            <UButton type="submit" label="บันทึก" size="xl" :ui="{ size: {xl: 'text-lg text-black'}, padding: { xl: 'px-4 py-1'} }"/>
        </div>
    </div>
</template>


<script setup>
    import moment from "moment"


    const props = defineProps(['form', 'auth', 'items', 'room', 'view'])
    const emit = defineEmits(['approve', 'notApprove'])
    const authStore = useAuthStore()
    



    const objectives = ref([])
    const supports = ref([])

    onMounted(() => {
        fetchType()
    })

    const dateNow = ref(moment(new Date()))


    const joiner = ref({
        username: null,
        role: null,
        positionID: null
    })

    const canApprove = computed(() => authStore.user.userInGroups.some(p => p.userGroupId === "แอดมิน Meeting/Booking" && p.isInGroup === true))
  

    const fetchType = async () => {
        const resObject = await postApi('/bk/type/ListData' , {
            TypeKey: "OBJECTIVE",
            SearchText: '',
        }) 
        objectives.value = resObject
    }

    const joinerColumns = [{
            key: 'id',
            label: 'ลำดับ',
        }, {
            key: 'fullname',
            label: 'ชื่อ - นามสกุล',
        }, {
            key: 'positionID',
            label: 'ตำแหน่งบริหาร',
        }, {
            key: 'join_role',
            label: 'ตำแหน่งที่ประชุม',
        }, {
            key: 'actions',
            label: 'จัดการข้อมูล',
        }
    ]

    const labelStartDate = computed(() => moment(props.form.date_begin).format('DD/MM/YYYY เวลา HH:mm'))
    const labelEndDate = computed(() => moment(props.form.date_end).format('DD/MM/YYYY เวลา HH:mm'))
    
   // Pagination
    const pagejoiner = ref(1)
    const pagejoinerCount = ref(10)
    const pagejoinerTotal = computed(() => props.form.joiners.length) // This value should be dynamic coming from the API
    const pagejoinerFrom = computed(() => (pagejoiner.value - 1) * pagejoinerCount.value + 1)
    const pagejoinerTo = computed(() => Math.min(pagejoiner.value * pagejoinerCount.value, pagejoinerTotal.value))


    const searchUser = async (q) => {
        const users = await postApi('/Person/ListUserInfoWithPage' , {
            Search: q,
            skip: 0,
            take: 50,
        }) 

        return users.userInfo.map(user => ({ id: user.username, label: user.fullName, positionID: user.positionID, fullname: user.fullName })).filter(Boolean)
    }


    const searchPosition = async (q) => {
        const positions = await postApi('/bk/type/ListData' , {
            TypeKey: "JOIN_ROLE",
            SearchText: q,
        }) 
        return positions.map(position => ({ id: position.type_id, label: position.type_name })).filter(Boolean)
    }
    const addJoiners = () => {

        const index = props.form.joiners.findIndex(join => join.username === joiner.username);
        if (index > -1) { // only splice array when item is found
            props.form.joiners.splice(index, 1); // 2nd parameter means remove one item only
        }else {
            props.form.joiners.push({
                username: joiner.value.username.id,
                fullname: joiner.value.username.fullname,

                positionID: joiner.value.username.positionID,
                join_role: joiner.value.role,
            })
        }

        joiner.value = {
            username: null,
            role: null,
            positionID: null
        }

    }

    const deleteJoiner = (index) => {
        props.form.joiners.splice(index, 1); 
    }

    const addItems = (e) => {
        const { value } = e.target

        const index = props.items.indexOf(value);
        if (index > -1) { // only splice array when item is found
            props.items.splice(index, 1); // 2nd parameter means remove one item only
        }else {
            props.items.push(value)
        }
    } 

    const checkedItems = (name) => {
        return props.items.some(item => item == name)
    }
    

</script>