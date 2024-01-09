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

    
    const config = ref({
        //locale: "th-TH",
        style: {
            // When adding a custom font, please also set the fallback(s) yourself
            fontFamily: `'Kanit', sans-serif`,
        },
    })

    const events = ref([
        // ...
        {
            title: "Advanced algebra",
            with: "Chandler Bing",
            time: { start: "2024-01-10 12:05", end: "2024-01-10 23:05" },
            color: "yellow",
            isEditable: false,
            id: "753944708f0f",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!"
        },
        {
            title: "Ralph on holiday",
            with: "Rachel Greene",
            time: { start: "2024-01-07 12:05", end: "2024-01-10 23:05"  },
            color: "green",
            isEditable: false,
            id: "5602b6f589fc"
        }
        // ...
    ]) 
</script>

<style lang="css">
   .calendar-month__weekday {
        @apply !min-h-[150px] px-2 ;
   }
   .calendar-month__event {
        @apply !text-base
   }
</style>