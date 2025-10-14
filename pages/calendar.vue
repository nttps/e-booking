<template>
    <div class="text-3xl font-bold mb-4">ปฎิทิน</div>
    <div class="bg-white rounded-md py-4 px-6">
        
        <div class="mb-2 flex justify-between items-center space-x-4">
            <UFormGroup label="ค้นหาห้องประชุม" class="w-4/6">
                <USelectMenu 
                    value-attribute="room_name" 
                    class="w-full" 
                    option-attribute="room_name" 
                    :options="rooms" 
                    v-model="nameSearch" 
                    searchable 
                    placeholder="ค้นหาห้องประชุม" 
                    size="xl" 
                    searchable-placeholder="ค้นหาห้องประชุม" 
                />
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

        <FullCalendar 
            :options="calendarOptions"
            @eventClick="handleEventClick"
        />
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
                <div v-if="viewEventCurrent.extendedProps?.with">
                    <span class="font-bold">จองโดย</span> : {{ viewEventCurrent.extendedProps.with }} 
                </div>
                <div>
                    <span class="font-bold">รายละเอียด</span> : {{ viewEventCurrent.extendedProps?.description || viewEventCurrent.title }} 
                </div>
                <div>
                    <span class="font-bold">ช่วงเวลา</span> : {{ formatEventDateTime(viewEventCurrent.start) }} ถึง {{ formatEventDateTime(viewEventCurrent.end) }}
                </div>
            </div>
        </UCard>
    </UModal>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { ref, computed } from 'vue'

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

// แปลงข้อมูลจาก API ให้เป็นรูปแบบ FullCalendar
const { data: events, pending, refresh } = await useAsyncData('events', async () => {
    const rawEvents = await postApi('/bk/book/ListCalendar' , {
        search: nameSearch.value === 'ทั้งหมด' ? '' : nameSearch.value,
    })
    
    return rawEvents.map(event => {
        // เอาตัวเลขเวลาออกจากชื่อ event
        const cleanTitle = event.title
            .replace(/^[\d\s:\.]+/, '') // เอาตัวเลข เวลา และจุดที่ขึ้นต้น
            .replace(/^\d+[:\s\.]+\d*\s*/, '') // เอาตัวเลขเวลาที่ขึ้นต้น
            .replace(/^[0-9]+[:\s\.]*[0-9]*\s*/, '') // เอาตัวเลขใดๆ ที่ขึ้นต้น
            .trim()
        
        return {
            id: event.id,
            title: cleanTitle,
            start: event.time.start,
            end: event.time.end,
            backgroundColor: event.color,
            textColor: event.color === '#ff0000' ? 'white' : 'black',
            extendedProps: {
                with: event.with,
                description: event.description,
                originalEvent: event
            }
        }
    })
}, {
    default: () => [],
    watch: [nameSearch]
})

const handleEventClick = (info) => {
    // ปิด popup ของ FullCalendar ก่อน
    const popovers = document.querySelectorAll('.fc-popover')
    popovers.forEach(popover => {
        popover.style.display = 'none'
    })
    
    viewEvent.value = true
    viewEventCurrent.value = info.event
}

const formatEventDateTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    
    const dateStr = d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    
    // ตรวจสอบว่ามีเวลาหรือไม่
    const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0
    
    if (hasTime) {
        const timeStr = d.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit'
        })
        return `${dateStr} เวลา ${timeStr}`
    }
    
    return dateStr
}

const calendarOptions = computed(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    locale: 'th',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    buttonText: {
        today: 'วันนี้',
        month: 'เดือน',
        week: 'สัปดาห์',
        day: 'วัน',
        list: 'รายการ'
    },
    views: {
        dayGridMonth: {
            titleFormat: { year: 'numeric', month: 'long' }
        },
        timeGridWeek: {
            titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
        },
        timeGridDay: {
            titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
        },
        listWeek: {
            titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
        }
    },
    events: events.value,
    eventDisplay: 'block',
    dayMaxEvents: 3,
    moreLinkClick: 'popover',
    height: 'auto',
    aspectRatio: 1.8,
    eventClick: handleEventClick,
    // ซ่อนเวลาที่แสดงในปฏิทิน (เฉพาะ month view)
    displayEventTime: false,
    displayEventEnd: false,
    // เปลี่ยนข้อความ moreLink
    moreLinkText: 'แสดงเพิ่มเติม',
    // ตั้งค่าสำหรับ week และ day view
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    slotDuration: '01:00:00',
    slotLabelInterval: '01:00:00',
    allDaySlot: true,
    nowIndicator: true
}))
</script>

<style>
/* ปรับแต่งสไตล์ FullCalendar */
.fc {
    font-family: 'Kanit', sans-serif;
}

.fc-event {
    border-radius: 4px;
    border: none;
    font-size: 0.875rem;
    padding: 2px 4px;
}

.fc-daygrid-event {
    margin: 1px 0;
}

.fc-daygrid-day-number {
    font-weight: 500;
}

.fc-toolbar-title {
    font-size: 1.5rem;
    font-weight: 600;
}

.fc-button {
    background-color: #f3f4f6;
    border-color: #d1d5db;
    color: #374151;
    font-weight: 500;
}

.fc-button:hover {
    background-color: #e5e7eb;
}

.fc-button:focus {
    box-shadow: 0 0 0 2px #3b82f6;
}

.fc-button-primary {
    background-color: #3b82f6;
    border-color: #3b82f6;
    color: white;
}

.fc-button-primary:hover {
    background-color: #2563eb;
}

/* Multi-day events styling */
.fc-event.fc-event-start {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.fc-event.fc-event-end {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.fc-event.fc-event-start.fc-event-end {
    border-radius: 4px;
}

/* แก้ไข z-index ของ popup รายการเพิ่มเติม */
.fc-popover {
    z-index: 1000 !important;
}

/* แก้ไข z-index ของ modal รายละเอียด */
.fc-event-popover {
    z-index: 1001 !important;
}

/* เพิ่ม z-index สำหรับ modal และ overlay */
.relative {
    z-index: 99999 !important;
}


/* ปรับแต่งสไตล์สำหรับ week และ day view */
.fc-timegrid-slot {
    height: 2.5em;
}

.fc-timegrid-event {
    font-size: 0.875rem;
    padding: 2px 4px;
}

.fc-timegrid-event .fc-event-title {
    font-weight: 500;
}

.fc-timegrid-axis {
    font-size: 0.75rem;
    color: #6b7280;
}

.fc-timegrid-slot-label {
    font-size: 0.75rem;
    color: #6b7280;
}

/* ปรับแต่งสไตล์สำหรับ list view */
.fc-list-event {
    padding: 8px 12px;
    border-radius: 4px;
    margin: 2px 0;
}

.fc-list-event-title {
    font-weight: 500;
}

.fc-list-event-time {
    color: #6b7280;
    font-size: 0.875rem;
}
</style>
