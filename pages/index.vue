<template>
    <h2 class="text-4xl font-bold mb-4">จองห้องประชุม</h2>
    <div class="flex space-x-4 mb-4">
        <div class="w-2/6">
            <label for="">วันที่/เวลา เริ่มประชุม *</label>
        </div>
        <div class="w-4/6">

        </div>
       
    </div>
    <div class="flex space-x-4 mb-4">
        <div class="w-2/6">
            <label for="">วันที่/เวลา สิ้นสุดประชุม *</label>
        </div>
        <div class="w-4/6">

        </div>
    </div>

    <div class="flex space-x-4 mb-4">
        <div class="w-4/6">
            <UInput placeholder="ชื่อห้องประชุม" size="xl" />
        </div>
        <div class="w-2/6">
            <UInput placeholder="จำนวนผุ้เข้าประชุม" size="xl" />
        </div>
    </div>

    <div class="flex space-x-4">
        <div class="w-3/6">
            <UInput placeholder="อาคาร" size="xl" />
        </div>
        <div class="w-2/6">
            <USelect :options="[]" placeholder="สถานะ" size="xl" />
        </div>
        <div class="w-1/6 text-center">
            <UButton label="ค้นหา" size="xl" />
        </div>
    </div>


    <div class="bg-white flex space-x-4  p-4 my-4" v-for="room in rooms">
        
        <div class="w-4/12">
            <img src="" alt="">
        </div>
        <div class="w-8/12">
            <div class="font-bold text-xl mb-2">{{ room.room_name }}</div>
            <div class="flex items-center space-x-2 mb-2 text-gray-500">
                <Icon name="heroicons:user-group-20-solid" size="30px" /> <span>{{ room.capacity }}</span>
            </div>
            <div class="flex items-center space-x-2 mb-2 text-gray-500">
                <Icon name="clarity:building-line" size="30px" /> <span>{{ room.building_id }}</span>
            </div>
            <div class="flex items-center space-x-2 mb-2 text-gray-500">
                <span>สถานะ</span> <span class="rounded-full px-4 text-black" :class="{ 'bg-green-400': room.status === 'ปกติ', 'bg-red-400': room.status !== 'ปกติ'}">{{ room.status }}</span>
            </div>
            <div class="text-right">
                <NuxtLink :to="`/room/${room.room_id}`" class="mr-4">ดูเพิ่มเติม</NuxtLink>
                <UButton label="จอง" @click="navigateTo(`/room/${room.room_id}/booking`)" size="xl" :ui="{ size: {xl: 'text-lg text-black'}, padding: { xl: 'px-4 py-1'} }"/>
            </div>
        </div>
      

    </div>
    
    
</template>


<script setup>
    definePageMeta({
        title: 'ความรู้มุ่งสู่ความสำเร็จ',
        middleware: 'auth'
    })


    onMounted(() => {
        fetchRooms()

    });

    const rooms = ref()

    const fetchRooms = async () => {
       rooms.value = await listRooms({})
    }
   
   
</script>



<style lang="scss">

</style>