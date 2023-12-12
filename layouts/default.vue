<template>
  <div>
    <Header />
      <main class="px-8 py-4 bg-zinc-300">
        <slot />
      </main>
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