<template>
    <div class="text-3xl font-bold mb-4">ปฎิทิน</div>
    <div class="bg-white rounded-md py-4 px-6">
        
        <div class="mb-2 flex justify-between items-center space-x-4">
            <UFormGroup label="ค้นหาห้องประชุม" class="w-4/6">

                <USelectMenu value-attribute="room_name" class="w-full" option-attribute="room_name" :options="rooms" v-model="nameSearch" searchable placeholder="ค้นหาห้องประชุม" size="xl" searchable-placeholder="ค้นหาห้องประชุม" />
            </UFormGroup>
            <div class="w-2/6 self-end">
                 <UButton
                    color="gray"
                    size="xl"
                    :disabled="nameSearch === ''"
                    @click="resetFilters"
                >
                    ล้างค่าการค้นหา
                </UButton>
            </div>
        </div>
        <Qalendar 
            :events="events"
            :config="config"
            
        >

            <template #weekDayEvent="eventProps">
               
                <div class="p-2" :style="{ backgroundColor: eventProps.eventData.color, color: '#000', width: '100%', height: '100%', overflow: 'hidden' }">
                    <div class="flex items-center is-title">
                        {{ eventProps.eventData.title }}
                    </div>
                    <div class="flex items-center is-time">
                        <Icon
                            name="i-material-symbols-alarm-outline"
                        />
                        <span class="ml-2">{{ getEventTime(eventProps.eventData) }}</span>
                    </div>
                    <div
                        v-if="eventProps.eventData.with"
                        class="flex items-center is-with"
                    >
                        <Icon
                            name="i-material-symbols-person-book"
                        />
                        <span class="ml-2">{{ eventProps.eventData.with }}</span>
                    </div>
                    <div
                        v-if="eventProps.eventData.description"
                        class="flex items-center is-description"
                    >
                        <Icon
                            name="i-material-symbols-description"
                        />
                        <!-- eslint-disable vue/no-v-html -->
                        <p class="ml-2" v-html="eventProps.eventData.description" />
                        <!--eslint-enable-->
                    </div>
                </div>
            </template>
            <template #dayCell="{dayData}">
                <div>
                    <div class="text-center"> {{ dayData.dateTimeString.substring(8, 10).startsWith('0') ? dayData.dateTimeString.substring(9, 10) : dayData.dateTimeString.substring(8, 10) }}</div>
                    
                </div>
                
                <div v-for="(event, index) in dayData.events" class=" w-full mb-1" @click="clickDay(event)">
                    <div v-if="index < 3" :style="`background-color: ${event.color}; color:${event.color == '#ff0000' ? 'white' : 'black'}`" class="px-2 w-full cursor-pointer">
                        {{ event.title }}
                    </div>
                    <div v-if="selectDate == dayData.dateTimeString && index > 3" :style="`background-color: ${event.color}; color:${event.color == '#ff0000' ? 'white' : 'black'}`" class="px-2 w-full cursor-pointer">
                        {{ event.title }}
                    </div>
                </div>
                <div
                    v-if="selectDate != dayData.dateTimeString && dayData.events.length >= 4"
                    class="text-sm"
                    @click="showMore(dayData.dateTimeString)"
                >
                    ดูรายการเพิ่มเติม
                </div>
            </template>
        </Qalendar>
    </div>

    <UModal v-model="viewEvent">
        <UCard
            :ui="{
            base: 'h-full flex flex-col',
            rounded: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            body: {
                base: 'grow'
            }
            }"
        >
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-xl text-center font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ viewEventCurrent.title }}
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="viewEvent = false" />
                </div>
            </template>

            <div>
                <div v-if="viewEventCurrent.with"><span class="font-bold">จองโดย</span> : {{ viewEventCurrent.with }} </div>
                <div><span class="font-bold">รายละเอียด</span> : {{ viewEventCurrent.description || viewEventCurrent.title }} </div>
                <div><span class="font-bold">ช่วงเวลา</span> {{ viewEventCurrent.time.start }} ถึง {{ viewEventCurrent.time.end }} </div>

            </div>
        </UCard>
    </UModal>
</template>

<script setup>
import { Qalendar } from "qalendar";
    import "qalendar/dist/style.css"

    useSeoMeta({
        title: 'ปฎิทิน'
    })

    const nameSearch = ref('')
    const viewEvent = ref(false)
    const viewEventCurrent = ref(null)


    const rooms = ref([{
        room_name: 'ทั้งหมด'
    }])

    const resetFilters = () => {
        nameSearch.value = "ทั้งหมด"
    }

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

    const clickDay = (data) =>{
        viewEvent.value = true
        viewEventCurrent.value = data
    }


    const selectDate = ref(null)

    const showMore = (day) => {
        selectDate.value = day

    }
    const mode = ref('month')

    
    const config = ref({
        //locale: "th-TH",
        defaultMode: 'month',
        style: {
            // When adding a custom font, please also set the fallback(s) yourself
            fontFamily: `'Kanit', sans-serif`,
        },
    })

    const getEventTime = (event) => {
      return (
        getLocalizedTime(event.time.start) +
        ' - ' +
        getLocalizedTime(event.time.end)
      );
    }

    const getAllVariablesFromDateTimeString = (dateTimeString) => {
        return {
            year: +dateTimeString.substring(0, 4),
            month: +dateTimeString.substring(5, 7) - 1,
            date: +dateTimeString.substring(8, 10),
            hour: hourFrom(dateTimeString),
            minutes: minutesFrom(dateTimeString),
        };
    }

    const  getLocalizedTime = (dateTimeString) => {
        // Though only displaying time, the exact date is needed, because otherwise time will be displayed
        // incorrectly on days when daylight saving time changes
        const {
            year,
            month,
            date,
            hour,
            minutes,
        } = getAllVariablesFromDateTimeString(dateTimeString);
        const d = new Date(year, month, date, hour, minutes);

        return d.toLocaleTimeString('th-TH', {
            hour: "numeric",
            minute: "numeric",
        });
    }

    const hourFrom = (dateTimeString) => {
        return +dateTimeString.substring(11, 13);
    }

    const minutesFrom = (dateTimeString) => {
        return +dateTimeString.substring(14, 16);
    }
</script>

<style lang="css">
   .calendar-month__weekday {
        @apply !min-h-[150px] px-2 ;
   }
   .calendar-month__event {
        @apply !text-base
   }
</style>