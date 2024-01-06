<template>
    <div>
        <div class="text-3xl font-bold mb-4">รายการจองทั้งหมด</div>
        <div class="flex justify-between items-center w-full mb-4">
            <!-- Filters -->
            <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="ชื่อห้องประชุม" size="xl" />
                </div>
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="ตำนวนผู้เข้าประชุม" size="xl" />
                </div>
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="วันที่เริ่ม" size="xl" />
                </div>
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="วันที่สิ้นสุด" size="xl" />
                </div>
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="อาคาร" size="xl" />
                </div>
                <div class="flex items-center gap-1.5">
                    <UInput v-model="nameSearch" placeholder="สถานะ" size="xl" />
                </div>
            </div>
            
            <div class="flex gap-1.5 items-center">
                <UButton
                    icon="i-heroicons-magnifying-glass"
                    color="gray"
                    size="xl"
                    trailing
                >
                    ค้นหา
                </UButton>
                <UButton
                    color="gray"
                    size="xl"
                    :disabled="nameSearch === '' && typeSearch === ''"
                    @click="resetFilters"
                >
                    ล้างค่าการค้นหา
                </UButton>
            </div>
        </div>
        
        <!-- Table -->
        <UTable
        
            :rows="booking"
            :columns="columns"
            :loading="pending"
            class="w-full"
            :loading-state="{ label: 'กำลังโหลด ...' }" 
            :empty-state="{ label: 'ไม่พบรายการ' }"
        >


            <template #detail-data="{ row }">
                <NuxtLink to="">รายละเอียด </NuxtLink>
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
                <div class="flex space-x-4">
                    <div v-if="row.status === 'รออนุมัติ'">
                        <UButton label="แก้ไข" @click="edit(row.bk_no)" />
                    </div>

                    <div v-if="row.status !== 'อนุมัติ'">
                        <UButton label="ลบ" color="red" @click="modalDelete = true; dataDelete = row.bk_no"/>
                    </div>
                </div>
              
            </template>
            
        </UTable>
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

    <UModal v-model="modalEdit" :ui="{ width: 'sm:max-w-6xl'}" @close="closeModal">
        <UForm :state="form" @submit="submit">

            <FormBooking :form="form" :auth="authStore" :items="items" :room="room" /> 
        </UForm>
        
    </UModal>

    <ModalAlertDelete v-model="modalDelete" @confirm="deleteItem"/>

</template>

<script setup>
  import moment from 'moment'

    const authStore = useAuthStore()

    const modalEdit = ref(false)
    const nameSearch = ref("")
    const typeSearch = ref("")


    const modalDelete = ref(false)
    const dataDelete = ref(null)


    // Columns
    const columns = [{
        key: 'bk_no',
        label: 'เลขที่เอกสาร',
    }, {
        key: 'station_name',
        label: 'ห้องประชุม',
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

    const form = ref({})


    const edit = async (id) => {
        const data = await getApi(`/bk/room/GetDocSet?room_id=${id}`)

        form.value = data.booking
        form.joiners = data.joiners


        modalEdit.value = true
    }

     
    const deleteItem = async () => {
        const data = await deleteApi('/bk/book/DeleteDoc' , {
            bkNO: dataDelete.value,//รหัส staff
            ActionBy: authStore.username//current user login
        })

        modalDelete.value = false
        refresh()
    }
</script>

<style lang="scss" scoped>

</style>