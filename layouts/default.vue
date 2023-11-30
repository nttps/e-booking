<template>
  <div>
    <Header />
        <slot />
    <Footer />
  </div>
</template>


<script setup>
  const route = useRoute()
  useHead({
    title: `DDPM E-Booking - ${route.meta.title}`,
    meta: [{ property: 'og:title', content: `DDPM E-Booking - ${route.meta.title}` }]
  })
</script>