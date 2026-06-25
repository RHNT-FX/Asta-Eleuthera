<script setup>
import { onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import VisiMisiSection from '@/components/profile/VisiMisiSection.vue'
import SejarahSection from '@/components/profile/SejarahSection.vue'
import PengurusSection from '@/components/profile/PengurusSection.vue'
import GallerySection from '@/components/profile/GallerySection.vue'
import MapSection from '@/components/home/MapSection.vue'

const profileStore = useProfileStore()

onMounted(async () => {
  await Promise.all([
    profileStore.fetchProfile(),
    profileStore.fetchGallery()
  ])
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Hero Banner -->
    <section class="relative pt-32 pb-20 bg-[var(--color-rt-primary)] overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1920')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-rt-primary)]"></div>
      </div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div v-animate class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
          <span class="w-2 h-2 rounded-full bg-[var(--color-rt-accent)]"></span>
          <span class="text-xs font-semibold tracking-wider text-white uppercase" style="font-family: var(--font-sans);">Mengenal Lebih Dekat</span>
        </div>
        <h1 v-animate class="delay-100 text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style="font-family: var(--font-serif);">
          Profil RT 27
        </h1>
        <p v-animate class="delay-200 text-lg text-white/80 max-w-2xl mx-auto">
          Informasi lengkap mengenai sejarah, visi misi, jajaran pengurus, serta galeri kegiatan di lingkungan RT 27.
        </p>
      </div>
    </section>

    <!-- Sections -->
    <VisiMisiSection />
    <SejarahSection />
    <PengurusSection />
    <GallerySection />
    <MapSection />
  </div>
</template>
