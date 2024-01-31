<template>
    <div>
        <div class="text-4xl font-bold mb-4">
            {{ room.room_name }}
        </div>

        <div class="bg-white p-8">
            <div class="lg:flex lg:space-x-8">
                <div class="lg:w-1/2 mb-4 lg:mb-0  transition-all delay-75">
                    <img :src="room.photo ? room.photo_url : `/public/images/no-cover.jpg`" ref="mainImage" :alt="room.room_name"  class="object-contain w-full mb-4  transition-all delay-75"/>

                    <div class="flex space-x-4">
                        <div v-for="(image, index) in images" class="rounded-md  transition-all delay-75">
                            <img :src="image.imgUrl" :alt="room.room_name" class="object-contain w-full cursor-pointer  transition-all delay-75" @click="imageToMain(index)" />
                        </div>
                    </div>
                </div>
                <div class="lg:w-1/2">
                    <h2 class="font-bold text-2xl">รายละเอียดห้องประชุม</h2>
                    <table class="border-separate border-spacing-y-2 w-full text-xl">
                        <tr>
                            <td>รหัสห้องประชุม</td>
                            <td>{{ room.room_id }}</td>
                        </tr>
                        <tr>
                            <td>ชื่อห้องประชุม</td>
                            <td>{{ room.room_name }}</td>
                        </tr> 
                        <tr>
                            <td>จำนวนผู้เข้าประชุม</td>
                            <td>{{ room.capacity }}</td>
                        </tr> 
                        <tr>
                            <td>อาคาร</td>
                            <td>{{ room.building_id }}</td>
                        </tr>
                        <tr>
                            <td>ชั้น</td>
                            <td>{{ room.floor_id }}</td>
                        </tr>
                    </table>
                    <div class="text-right">
                        <UButton label="จอง" @click="navigateTo(`/room/${room.room_id}/booking`)" size="xl" :ui="{ size: {xl: 'text-lg text-black'}, padding: { xl: 'px-4 py-1'} }"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

    const route = useRoute()

    const room = ref({})
    const images = ref()
    const mainImage = ref()
    onMounted(() => {
        fetchData()
    })



    const fetchData = async () => {

        const data = await getApi(`/bk/room/GetDocSet?room_id=${route.params.id}`)
        room.value = data.rooms
        images.value = data.imgs
        
    }

    const imageToMain = (index) => {

        mainImage.value.src = images.value[index].imgUrl

    }
</script>

<style lang="scss" scoped>

</style>