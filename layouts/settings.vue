<template>
  <Header />
      <div class="py-8 px-10 bg-[#E0E0E0]">
          <div class="md:flex bg-white rounded-[20px] space-x-4 p-10 min-h-screen">
            <div class="hidden sm:block flex-shrink-0 w-72">
              <SettingsMenu />
            </div>
            <div class="flex-1 overflow-x-auto">
                <div class="text-4xl font-semibold text-right border-b border-black pb-8 px-5 mb-8 flex justify-end items-center">
                  <Icon :name="route.meta.key ? route.meta.key.icon : 'ic:round-settings'" class="mr-4" size="40"/>
                  <div>{{ route.meta.key ? route.meta.key.title : 'การตั้งค่า' }}</div>
                </div>
                <slot />
              </div>
          </div>
      </div>
  <Footer />
</template>


<script setup>
  const route = useRoute()

  const title = computed(() => route.meta.title)

  useHead({
    title: `ตั้งค่า - ${title.value}`,
    meta: [{ property: 'og:title', content: `ตั้งค่า - ${title.value}` }]
  })
</script>