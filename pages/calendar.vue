<template>
    <div class="text-3xl font-bold mb-4">ปฎิทิน</div>
    <div class="bg-white rounded-md py-4 px-6">
        
        <div class="flex items-center justify-between gap-3 mb-2">
            <div class="flex items-center gap-1.5">
                <UInput v-model="nameSearch" placeholder="ชื่อห้องประชุม" size="xl" />
            </div>
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

   const { data: events, pending, refresh } = await useAsyncData('events', async () => await postApi('/bk/book/ListCalendar' , {
            search: nameSearch.value,

        }) 
    , {
        default: () => [],
        watch: [nameSearch]
    })

    
    const config = ref({
        //locale: "th-TH",
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