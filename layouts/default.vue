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
    titleTemplate: (titleChunk) => {
      return titleChunk ? `DDPM E-Booking - ${titleChunk}` : 'DDPM E-Booking';
    },
    meta: [{ property: 'og:title', content: `DDPM E-Booking - ${route.meta.title}` }]
  })
</script>