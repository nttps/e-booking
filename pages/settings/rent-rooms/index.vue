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
                    ห้องประชุม
                </h2>
            </template>
            <div class="flex justify-between items-center w-full mb-4">
                <!-- Filters -->
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-1.5">
                        <UInput v-model="nameSearch" placeholder="ชื่อห้องประชุม" />
                    </div>
                    <div class="flex items-center gap-1.5">
                        <UInput v-model="nameSearch" placeholder="อาคาร" />
                    </div>
                    <div class="flex items-center gap-1.5">
                        <UInput v-model="nameSearch" placeholder="ชั้น" />
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
                    <UButton label="เพิ่มข้อมูล" color="amber" @click="modalAdd = true; form.facilities = amenities; fetchDepartments()"/>
                </div>
            </div>
            
            <!-- Table -->
            <UTable
            
                :rows="rooms.slice((page - 1) * pageCount, (page) * pageCount)"
                :columns="columns"
                :loading="pending"
                class="w-full"
                :ui="{ td: { base: 'max-w-[0] truncate' } }"
                :loading-state="{ label: 'กำลังโหลด ...' }" 
                :empty-state="{ label: 'ไม่พบรายการ' }"
            >


                <template #modified_date-data="{ row }">
                    {{ row.modified_date ? moment(row.modified_date).format('DD/MM/YYYY HH:hh') : '-' }}
                </template>

                 <template #image-data="{ row }">
                    <img :src="row.photo_url" class="w-[150px] object-contain" alt="">
                </template>


                <template #station_name-data="{ row }">
                    {{ row.station_name || row.loc_name }}
                </template>
                <template #actions-data="{ row }">
                    <div class="text-center">
                        <UButton
                            icon="i-heroicons-pencil-solid"
                            color="emerald"
                            square
                            variant="link"
                            @click="edit(row.room_id)"
                        />

                        <UButton
                            icon="i-heroicons-trash-solid"
                            color="red"
                            square
                            variant="link"
                            @click="modalDelete = true; dataDelete = row.room_id"
                        />
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
                        :total="rooms.length"
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
            <UCard
                class="w-full"
            >
            
                <template #header>
                    <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                        ห้องประชุม
                    </h2>
                </template>

                <UFormGroup label="ชื่อห้องประชุม" class="flex space-x-2 mb-4" size="xl" :ui="uiFormGroup">
                    <UInput placeholder="" v-model="form.room_name" required/>
                </UFormGroup>
                <UFormGroup label="จำนวนผู้เข้าห้องประชุม" class="flex space-x-2 mb-4" size="xl" :ui="uiFormGroup">
                    <UInput placeholder="" v-model.number="form.capacity" type="number" required>
                        <template #trailing>
                            <span class="text-gray-500 dark:text-gray-400 ">คน</span>
                        </template>
                    </UInput>
                </UFormGroup>
                <UFormGroup label="อาคาร" class="flex space-x-2 mb-4" size="xl" :ui="uiFormGroup">
                    <UInput placeholder="" v-model="form.building_id" required />
                </UFormGroup>
                <UFormGroup label="ชั้น" class="flex space-x-2 mb-4" size="xl" :ui="uiFormGroup">
                    <UInput placeholder="" v-model="form.floor_id" required />
                </UFormGroup>

                <UFormGroup label="สิ่งอำนวยความสะดวก" class="flex items-center space-x-2 mb-4" size="xl" :ui="uiFormGroup">
                    <div class="grid grid-cols-4 gap-x-4 items-center">
                        <UCheckbox color="primary" 
                            v-model="facilitie.isSelect" 
                            :label="facilitie.facility_name" 
                            class="mb-2" 
                            :ui="{container: 'flex items-center h-6', base: 'h-5 w-5 dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-current dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent'}"
                            v-for="facilitie in form.facilities"
                        />
                    </div>
                </UFormGroup>
                <UFormGroup label="หน่วยงาน" class="flex space-x-2 mb-4" size="xl" :ui="uiFormGroup">
                    <USelectMenu :options="departments" value-attribute="valueTXT" option-attribute="valueTXT" v-model="form.department_id" required />
                </UFormGroup>


                
                <div class="flex space-x-2">
                    <div class="flex content-center items-center justify-between w-1/3">รูปภาพ</div>
                    <div class="mt-1 relative min-w-auto w-full">
                        <div class="flex space-x-4">
                            <div class="relative w-1/6" v-for="(image, index) in images">
                                <div class="absolute top-0 -right-2"> 
                                    <UButton color="red" :padded="true" variant="solid" icon="i-heroicons-x-mark-20-solid" size="xs" class="rounded-full -my-1" @click="removeImage(index)" />
                                </div>
                                <img :src="image.imgUrl" class=" object-contain w-full h-full cursor-pointer" alt=""  @click="editImage(index)">
                                
                            </div>
                            <div class="relative w-1/6">
                                <button type="button" @click="imageSelect = true">
                                    <Icon name="i-material-symbols-light-add-box-outline-sharp" size="100px" class="text-amber-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <div class="text-center flex justify-center space-x-8">
                        <UButton type="submit" label="เพิ่มข้อมูล" color="amber" size="xl" />
                        <UButton type="button" label="กลับ" color="gray" variant="outline" size="xl" @click="modalAdd = false; closeModal()" />
                    </div>  
                </template>
        
            </UCard>
        </UForm>

        
        <UModal v-model="imageSelect">
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="text-center">เลือกรูปภาพ</div>
            </template>

            <UInput type="file" @change="pickImage"/>

            <img :src="imageState.imgUrl" class="w-full"/>

            <template #footer>
                <div class="flex justify-between">
                    <button type="button" class="px-4 py-2 bg-red-600 text-base rounded-[5px] text-white" @click="confirmImage">ยืนยัน</button>
                    <button type="button" class="px-4 py-2 bg-gray-500 text-base rounded-[5px] text-white" @click="imageSelect = false">ยกเลิก</button>
                </div>
            </template>
            </UCard>
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
     const uiFormGroup = { label: { wrapper: 'flex content-center items-center justify-between w-1/3', base: 'block font-medium text-gray-700 dark:text-gray-200 font-bold'}, container: 'mt-1 relative min-w-auto w-full'}
   
    const authStore = useAuthStore()

    const modalAdd = ref(false)
    const imageSelect = ref(false)
    const modalDelete = ref(false)
    const preventClose = ref(false)

    const dataDelete = ref(null)

    const nameSearch = ref("")
    const typeSearch = ref("")

    const images = ref([])
    const amenities = ref([])

    const departments = ref([])
    onMounted(() => {
        fetchAmenities()
    })
    const fetchAmenities = async () => {
        const resObject = await getApi('/bk/type/ListRoomFacilitiesSelect') 

        amenities.value = resObject
    }
    
    const fetchDepartments = async () => {
        const resObject = await postApi('/MasterType/ListData', {
            MasterTypeID:"DEPARTMENT",
            SearchText:"",
            ShowSelectAll:false
            
        }) 

        departments.value = resObject
    }


    // Columns
    const columns = [{
        key: 'room_id',
        label: 'รหัสห้องประชุม',
    }, {
        key: 'room_name',
        label: 'ห้องประชุม',
    }, {
        key: 'capacity',
        label: 'จำนวนผู้เข้าประชุม',
    }, {
        key: 'building_id',
        label: 'อาคาร',
    }, {
        key: 'floor_id',
        label: 'ชั้น',
    }, {
        key: 'image',
        label: 'รูปภาพ',
    }, {
        key: 'actions',
        label: 'จัดการ',
    }]
  
    const resetFilters = () => {
        nameSearch.value = ""
    }
     // Pagination
    const page = ref(1)
    const pageCount = ref(10)
    const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
    const pageTotal = computed(() => rooms.value.length )
    const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

    // Data
    const { data: rooms, pending, refresh } = await useAsyncData('rooms', async () => await postApi('/bk/room/ListData' , {
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
        room_id:"",//รหัสสถานีดับเพลิง ปล่อยว่างหากต้องการสร้างใหม่ ,ถ้ามีค่าเป็นการอัพเดท
        room_ref: '',//รหัสของ Location หรือ อปท
        room_name:"",//รหัสอ้างอิงสถานีดับเพลิง
        capacity:"",// ชื่อสถานะดับเพลิง
        branch_id:"",//ชนิดถานี (ตอนนี้ยังไม่มี)
        building_id:"",//ชื่อหัวหน้าหน่วย
        floor_id:"",
        department_id: "",
        created_by: authStore.username,//current user login 
        modified_by:"",//current user login กรณีที่ต้องการแก้ไข
        facilities: []

    }

    const closeModal = () => {
        form.value = {
            room_id:"",//รหัสสถานีดับเพลิง ปล่อยว่างหากต้องการสร้างใหม่ ,ถ้ามีค่าเป็นการอัพเดท
            room_ref: '',//รหัสของ Location หรือ อปท
            room_name:"",//รหัสอ้างอิงสถานีดับเพลิง
            capacity:"",// ชื่อสถานะดับเพลิง
            branch_id:"",//ชนิดถานี (ตอนนี้ยังไม่มี)
            building_id:"",//ชื่อหัวหน้าหน่วย
            floor_id:"",
            department_id: "",
            created_by: authStore.username,//current user login 
            modified_by:"",//current user login กรณีที่ต้องการแก้ไข
            facilities: []

        }

        images.value = []
    }

    const form = ref(dataForm)
    const items = ref([])


    const edit = async (id) => {
        const data = await getApi(`/bk/room/GetDocSet?room_id=${id}`)

        fetchDepartments()

        form.value = data.rooms
        form.value.facilities = data.facilities
        images.value = data.imgs
        modalAdd.value = true

    }
    const submit = async ()  => {
        
        const data = await postApi('/bk/room/save' ,{
            rooms: form.value,
            facilities: form.value.facilities
        })
        modalAdd.value = false

        if(images.value.length > 0) {
            uploadImage(data.rooms.room_id)
        }else {
            closeModal()
            refresh()
        }
    }

    const deleteImage = async (id) => {
        const data = await getApi(`/bk/room/DeleteRoomPhoto?room_id=${id}`)
    }

    const uploadImage = async (id)  => {

        var formdata = new FormData();
        images.value.forEach(image => {
            formdata.append("files", image.imageFile);
        })

        const data = await imageUpload(`/bk/room/UploadRoomPhotos?room_id=${id}&created_by=${authStore.username}` , formdata )

        closeModal()
        refresh()

    }

    const deleteItem = async () => {
        const data = await deleteApi('/bk/room/Delete' , {
            RoomID: dataDelete.value,//รหัส staff
            DeletedBy: authStore.username//current user login
        })

        modalDelete.value = false
        refresh()
    }

    const imageState = ref({
        imageFile: null,
        imgUrl: null
    })
    const imageStateType = ref(null)

    const pickImage = (e) => {
        const file = e.target.files[0]
        const blob = URL.createObjectURL(file)

        imageState.value.imageFile = file
        imageState.value.imgUrl = blob
   }

    const confirmImage = () => {
        if(imageState.value.imageFile == null) return
        if(imageStateType.value !== null) {
            images.value[imageStateType.value] = imageState.value
        }else {
            images.value.push(imageState.value)
        }
        imageState.value = {
            imageFile: null,
            imgUrl: null
        }
        imageSelect.value = false
        preventClose.value = false
    }

    const editImage =  (index) => {
        imageState.value = images.value[index]
        imageStateType.value = index
        imageSelect.value = true
        preventClose.value = true
    }
    const removeImage = (index) => {
        if (index > -1) { // only splice array when item is found
            images.value.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
    

</script>

<style lang="scss" scoped>

</style>