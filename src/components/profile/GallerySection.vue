<script setup>
import { ref } from 'vue'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const gallery = profileStore.gallery

const sampleImages = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=800', caption: 'Kerja Bakti Warga' },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800', caption: 'Rapat Pengurus' },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800', caption: 'Kegiatan Posyandu' },
  { id: 4, image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', caption: 'Perayaan 17 Agustus' },
  { id: 5, image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15f?w=800', caption: 'Penanaman Pohon' },
  { id: 6, image_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800', caption: 'Pertemuan Rutin Bulanan' },
]

const displayImages = gallery.length > 0 ? gallery : sampleImages
const selectedImage = ref(null)

function openLightbox(image) {
  selectedImage.value = image
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  selectedImage.value = null
  document.body.style.overflow = ''
}
</script>

<template>
  <section class="py-24 bg-[var(--color-rt-dark)] relative overflow-hidden">
    <!-- Decorative -->
    <div class="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMS41IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjEiPjwvY2lyY2xlPgo8L3N2Zz4=')]"></div>
    
    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div class="text-center mb-16">
        <h2 v-animate class="text-3xl md:text-4xl font-bold text-white mb-4" style="font-family: var(--font-serif);">Galeri Kegiatan</h2>
        <div v-animate class="w-24 h-1 bg-[var(--color-rt-accent)] mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <div 
          v-for="(image, index) in displayImages" 
          :key="image.id"
          v-animate
          :class="`delay-${(index % 4) * 100}`"
          class="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
          @click="openLightbox(image)"
        >
          <img 
            :src="image.image_url" 
            :alt="image.caption" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-rt-dark)]/90 via-[var(--color-rt-primary)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <p class="text-white font-semibold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {{ image.caption || 'Tanpa Keterangan' }}
            </p>
            <div class="w-8 h-1 bg-[var(--color-rt-accent)] mt-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="selectedImage"
        class="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
        @click="closeLightbox"
      >
        <button 
          class="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          @click="closeLightbox"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="relative max-w-5xl w-full h-full flex flex-col items-center justify-center" @click.stop>
          <img 
            :src="selectedImage.image_url" 
            :alt="selectedImage.caption" 
            class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
          <p v-if="selectedImage.caption" class="text-white text-lg mt-6 bg-black/50 px-6 py-2 rounded-full backdrop-blur-md">
            {{ selectedImage.caption }}
          </p>
        </div>
      </div>
    </Transition>
  </section>
</template>
