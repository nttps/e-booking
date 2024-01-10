<template>
    <div class="text-3xl font-bold mb-4">ปฎิทิน</div>
    <div class="bg-white rounded-md py-4 px-6">
        
        <div class="mb-2">
                <UFormGroup label="ค้นหาห้องประชุม">

                    <USelectMenu value-attribute="room_name" class="w-full" option-attribute="room_name" :options="rooms" v-model="nameSearch" searchable placeholder="ค้นหาห้องประชุม" size="xl" search-attributes="ค้นหาห้องประชุม" />
                </UFormGroup>
        </div>
        <Qalendar 
            :events="events"
            :config="config"
        >
        </Qalendar>
    </div>
</template>

<script setup>
    import { Qalendar } from "qalendar";
    import "qalendar/dist/style.css"


    const nameSearch = ref('')

    const rooms = ref([{
        room_name: 'ทั้งหมด'
    }])

    onMounted(() => {
        fetchRooms()
    })

    const fetchRooms = async () => {
        const resObject = await listRooms({ })

        rooms.value = rooms.value.concat(resObject)
    }

    const { data: events, pending, refresh } = await useAsyncData('events', async () => await postApi('/bk/book/ListCalendar' , {
            search: nameSearch.value === 'ทั้งหมด' ? '' : nameSearch.value,

        }) 
    , {
        default: () => [],
        watch: [nameSearch]
    })

    
    const config = ref({
        //locale: "th-TH",
        defaultMode: 'month',
        style: {
            // When adding a custom font, please also set the fallback(s) yourself
            fontFamily: `'Kanit', sans-serif`,
        },
    })

</script>

<style lang="css">
   .calendar-month__weekday {
        @apply !min-h-[150px] px-2 ;
   }
   .calendar-month__event {
        @apply !text-base
   }
</style>