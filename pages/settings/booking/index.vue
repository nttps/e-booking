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
                    <UButton label="เพิ่มข้อมูล" color="amber" @click="modalAdd = true; getOtherItems()"/>
                </div>
            </div>
            
            <!-- Table -->
            <UTable
            
                :rows="booking.stations"
                :columns="columns"
                :loading="pending"
                class="w-full"
                :ui="{ td: { base: 'max-w-[0] truncate' } }"
                :loading-state="{ label: 'กำลังโหลด ...' }" 
                :empty-state="{ label: 'ไม่พบรายการ' }"
            >

                <template #id-data="{ row, index }">
                    {{ pageFrom + index }}
                </template>

                <template #modified_date-data="{ row }">
                    {{ row.modified_date ? moment(row.modified_date).format('DD/MM/YYYY HH:hh') : '-' }}
                </template>

                <template #station_name-data="{ row }">
                    {{ row.station_name || row.loc_name }}
                </template>
                <template #actions-data="{ row }">
                    <UButton
                        icon="i-heroicons-pencil-solid"
                        color="emerald"
                        square
                        variant="link"
                        @click="edit(row.fire_station_id)"
                    />

                    <UButton
                        icon="i-heroicons-trash-solid"
                        color="red"
                        square
                        variant="link"
                        @click="modalDelete = true; dataDelete = row.fire_station_id"
                    />
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

    <UModal v-model="modalAdd" :ui="{ width: 'sm:max-w-6xl'}" @close="closeModal">
        <UForm :state="form" @submit="submit">
            <UCard
                class="w-full"
            >
            
                <template #header>
                    <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                        เพิ่มหน่วยดับเพลิง / ทรัพยากร
                    </h2>
                </template>


                <template #footer>
                    <div class="text-center flex justify-center space-x-8">
                        <UButton type="submit" label="เพิ่มข้อมูล" color="amber" size="xl" />
                        <UButton type="button" label="กลับ" color="gray" variant="outline" size="xl" @click="modalAdd = false; closeModal()" />
                    </div>  
                </template>
        
            </UCard>
        </UForm>
        
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
    const groupFireItem = ref(null)


    // Columns
    const columns = [{
        key: 'id',
        label: 'เลขที่เอกสาร',
    }, {
        key: 'station_name',
        label: 'ห้องประชุม',
    }, {
        key: 'count_water_truck',
        label: 'จำนวนผู้เข้าประชุม',
    }, {
        key: 'count_pump',
        label: 'ตั้งแต่',
    }, {
        key: 'count_fire_truck',
        label: 'ถึง',
    }, {
        key: 'count_other_machine',
        label: 'ผู้อำนวยการ',
    }, {
        key: 'modified_by',
        label: 'วันที่ขอ',
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

    const dataForm = {
        fire_station_id:"",//รหัสสถานีดับเพลิง ปล่อยว่างหากต้องการสร้างใหม่ ,ถ้ามีค่าเป็นการอัพเดท
        loc_id: '',//รหัสของ Location หรือ อปท
        station_ref:"",//รหัสอ้างอิงสถานีดับเพลิง
        station_name:"",// ชื่อสถานะดับเพลิง
        station_type:"",//ชนิดถานี (ตอนนี้ยังไม่มี)
        boss_name:"",//ชื่อหัวหน้าหน่วย
        email:"",
        tel:"",
        lat: 13.736717,
        lon: 100.523186,
        created_by: authStore.username,//current user login 
        modified_by:"",//current user login กรณีที่ต้องการแก้ไข
        has_station: false,
        p_no: "",
        a_no: ""

    }

    const closeModal = () => {
        form.value = {
            fire_station_id:"",//รหัสสถานีดับเพลิง ปล่อยว่างหากต้องการสร้างใหม่ ,ถ้ามีค่าเป็นการอัพเดท
            loc_id: authStore.user.currentUserInfo.aptCode,//รหัสของ Location หรือ อปท
            station_ref:"",//รหัสอ้างอิงสถานีดับเพลิง
            station_name:"",// ชื่อสถานะดับเพลิง
            station_type:"",//ชนิดถานี (ตอนนี้ยังไม่มี)
            boss_name:"",//ชื่อหัวหน้าหน่วย
            email:"",
            tel:"",
            lat: authStore?.lat || 13.736717,
            lon: authStore?.lon || 100.523186,
            created_by: authStore.username,//current user login 
            modified_by:"",//current user login กรณีที่ต้องการแก้ไข
            has_station: false,
            p_no: "",
            a_no: ""

        }
        getListItems()
    }

    const form = ref(dataForm)
    const items = ref([])


    const edit = async (id) => {
        const data = await getApi(`/fr/FireStation/GetDocSet?station_id=${id}`)

        form.value = data.fireStationInfo
        groupFireItem.value = data.items

        modalAdd.value = true

    }


    const submit = async ()  => {
        
        const groupItemMap = groupFireItem.value.filter(g => g.sum_total > 0).map(group => {
            return group.items.filter(item => item.qty > 0).map(item => {

                if(item.qty < 1) return
                return {
                    item_id: item.item_id,
                    qty: item.qty
                }
            })
         }).flat()


        items.value = groupItemMap.concat(...machines.value.filter(item => item.item_id && item.qty))
        
        
        if(form.value.has_station) {
            addItemToFireStation()
        }else {
            addItemToLog()
        }


        modalAdd.value = false

        closeModal()
        refresh()

    }

    const addItemToFireStation = async () => {
        const data = await postApi('/fr/FireStation/Save' , {
            FireStationInfo: form.value,
            ItemsInStation: items.value
        })

        console.log(data);

    }

    const searchLoc = () => {

    }
    const addItemToLog = async () => {
        const data = await postApi('/fr/ItemInLoc/SaveBulkItem' , {
            ActionBy: authStore.username, 
            LocID: authStore.level ===  'อปท.' ? authStore.user.currentUserInfo.aptCode : form.value.loc_id,  //ถ้า Save ลงอปท. ให้มีเลข อปท.และปล่อยว่างที่ FireStationID
            FireStationID:"",//ถ้า Save FireStation. ให้มีเลข Fire Station และปล่อยว่างที่ LocID
            Items: items.value
        })

        console.log(data);
    }

    const deleteItem = async () => {
        const data = await deleteApi('/fr/FireStation/DeleteDoc' , {
            StationID: dataDelete.value,//รหัส staff
            DeletedBy: authStore.username//current user login
        })

        modalDelete.value = false
        refresh()
    }

    const removeItem = (index) => {
        if (index > -1) { // only splice array when item is found
            machines.value.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
    

</script>

<style lang="scss" scoped>

</style>