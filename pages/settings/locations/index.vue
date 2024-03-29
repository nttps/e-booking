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
                    ตำแหน่งในที่ประชุม
                </h2>
            </template>
            <div class="flex justify-between items-center w-full mb-4">
                <!-- Filters -->
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-1.5">
                        <UInput v-model="nameSearch" placeholder="ชื่อตำแหน่ง" />
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
                    <UButton label="เพิ่มข้อมูล" color="amber" @click="modalAdd = true;"/>
                </div>
            </div>
            
            <!-- Table -->
            <UTable
            
                :rows="joinRoles.slice((page - 1) * pageCount, (page) * pageCount)"
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
                            @click="edit(row.type_id)"
                        />

                        <UButton
                            icon="i-heroicons-trash-solid"
                            color="red"
                            square
                            variant="link"
                            @click="modalDelete = true; dataDelete = row.type_id"
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
                        :total="joinRoles.length"
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
                        ตำแหน่งในที่ประชุม
                    </h2>
                </template>

                <UFormGroup label="ตำแหน่ง" class="flex space-x-2 mb-4" size="xl" :ui="uiFormGroup">
                    <UInput placeholder="" v-model="form.type_name" required />
                </UFormGroup>
                <UFormGroup label="คำอธิบาย" class="flex space-x-2 mb-4" size="xl" :ui="uiFormGroup">
                    <UInput placeholder="" v-model="form.type_color" />
                </UFormGroup>
                <template #footer>
                    <div class="text-center flex justify-center space-x-8">
                        <UButton type="submit" label="เพิ่มข้อมูล" color="amber" :loading="loading" size="xl" />
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
     const uiFormGroup = { label: { wrapper: 'flex content-center items-center justify-between w-1/3', base: 'block font-medium text-gray-700 dark:text-gray-200 font-bold'}, container: 'mt-1 relative min-w-auto w-full'}
   
    const authStore = useAuthStore()


    const modalAdd = ref(false)
    const imageSelect = ref(false)
    const modalDelete = ref(false)

    const dataDelete = ref(null)

    const nameSearch = ref("")
    const typeSearch = ref("")

    const images = ref([])


    // Columns
    const columns = [ {
        key: 'type_name',
        label: 'ชื่อตำแหน่ง',
    }, {
        key: 'modified_by',
        label: 'สร้างโดย',
    }, {
        key: 'modified_date',
        label: 'แก้ไข',
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
    const pageTotal = computed(() => joinRoles.value.length )
    const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

    // Data
    const { data: joinRoles, pending, refresh } = await useAsyncData('joinRoles', async () => await postApi('/bk/type/ListData' , {
            TypeKey: "JOIN_ROLE",
            SearchText: nameSearch.value,
        }) 
    , {
        default: () => [],
        watch: [page, pageFrom, pageCount, nameSearch]
    })

    const dataForm = {
        type_key:"JOIN_ROLE",//VEHICLE , REASON , JOIN_ROLE
        type_id: genID(),
        type_name:"",//ชื่อของประเภท
        type_color:"",//color
        modified_by: authStore.username//เพิ่มใหม่ไม่ต้องใส่

    }

    const closeModal = () => {
        form.value = {
            type_key:"JOIN_ROLE",//VEHICLE , REASON , JOIN_ROLE
            type_id: genID(),
            type_name:"",//ชื่อของประเภท
            type_color:"",//color
            modified_by: authStore.username//เพิ่มใหม่ไม่ต้องใส่
        }
    }

    const form = ref(dataForm)
    const items = ref([])


    const edit = async (id) => {
        const data = await getApi(`/bk/type/GetDocSet?type_key=JOIN_ROLE&type_id=${id}`)

        form.value = data.types
        modalAdd.value = true

    }

    const loading = ref(false)

    const submit = async ()  => {
        loading.value = true
        const data = await postApi('/bk/type/save' , form.value)

      
        modalAdd.value = false

        closeModal()
        refresh()
        loading.value = false

    }

    const deleteItem = async () => {
        const data = await deleteApi('/bk/type/Delete' , {
            TypeKey:"JOIN_ROLE",
            TypeID: dataDelete.value,
            ActionBy: authStore.username
        })

        modalDelete.value = false
        refresh()
    }

</script>

<style lang="scss" scoped>

</style>