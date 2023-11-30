<template>
  <Header />
    <div class="py-8 px-10 bg-[#E0E0E0]">
        <div class=" bg-white rounded-[20px] gap-x-4 p-10 min-h-screen">
          <slot />
        </div>
    </div>
  <Footer />
</template>


<script setup>
  const route = useRoute()
  const props = defineProps(['title'])


  useHead({
    title: `ตั้งค่า - ${route.meta.title}`,
    meta: [{ property: 'og:title', content: `ตั้งค่า - ${route.meta.title}` }]
  })
</script>