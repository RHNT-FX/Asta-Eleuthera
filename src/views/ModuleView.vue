<script setup>
import { ref, onMounted } from 'vue'
import { useModuleStore } from '@/stores/module'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const moduleStore = useModuleStore()
const selectedCategory = ref('Semua')

const sampleModules = [
  {
    id: '1',
    title: 'Panduan Budidaya Bawang Dayak Lengkap',
    description: 'Modul ini berisi panduan komprehensif mulai dari persiapan bibit, media tanam, perawatan rutin, hingga proses panen dan pasca panen bawang dayak.',
    file_size: '2.4 MB',
    download_count: 145,
    category: 'Panduan'
  },
  {
    id: '2',
    title: 'Manfaat Kesehatan & Resep Olahan Bawang Dayak',
    description: 'Buku edukasi mengenai berbagai manfaat medis bawang dayak yang telah teruji klinis beserta resep-resep olahan tradisional maupun modern.',
    file_size: '1.8 MB',
    download_count: 89,
    category: 'Edukasi'
  },
  {
    id: '3',
    title: 'Pembuatan Pupuk Kompos Mandiri',
    description: 'Panduan praktis membuat pupuk kompos organik sendiri dari limbah rumah tangga untuk menyuburkan tanaman bawang dayak Anda.',
    file_size: '3.1 MB',
    download_count: 210,
    category: 'Pelatihan'
  }
]

async function loadModules() {
  await moduleStore.fetchModules({
    category: selectedCategory.value
  })
}

onMounted(() => {
  loadModules()
})

async function handleCategoryChange(cat) {
  selectedCategory.value = cat
  await loadModules()
}

async function handleDownload(module) {
  if (module.id.length > 5) { // Assuming real Supabase UUIDs are longer than sample IDs
    await moduleStore.incrementDownload(module.id, module.download_count)
  }
  
  if (module.file_url) {
    window.open(module.file_url, '_blank')
  } else {
    alert('Link unduhan tidak tersedia untuk modul contoh ini.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-rt-light)] pb-24">
    <!-- Header -->
    <div class="bg-[var(--color-rt-primary)] pt-32 pb-20 relative overflow-hidden text-white">
      <!-- Decor -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMS41IiBmaWxsPSIjZmZmZmZmIj48L2NpcmNsZT4KPC9zdmc+')]"></div>
      </div>
      <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>

      <div class="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div v-animate class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-6">
          <svg class="w-8 h-8 text-[var(--color-rt-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 v-animate class="delay-100 text-4xl md:text-5xl font-bold mb-6" style="font-family: var(--font-serif);">
          Modul Pelatihan
        </h1>
        <p v-animate class="delay-200 text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
          Kumpulan materi, panduan budidaya bawang dayak, dan modul edukasi lingkungan yang dapat Anda unduh secara gratis.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
      <!-- Categories -->
      <div class="bg-white rounded-2xl shadow-lg p-4 flex gap-2 overflow-x-auto hide-scrollbar mb-12">
        <button 
          @click="handleCategoryChange('Semua')"
          class="px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-colors"
          :class="selectedCategory === 'Semua' ? 'bg-[var(--color-rt-primary)] text-white shadow-md shadow-[var(--color-rt-primary)]/20' : 'text-gray-600 hover:bg-gray-100'"
        >
          Semua Modul
        </button>
        <button 
          v-for="cat in moduleStore.categories" 
          :key="cat"
          @click="handleCategoryChange(cat)"
          class="px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-colors"
          :class="selectedCategory === cat ? 'bg-[var(--color-rt-primary)] text-white shadow-md shadow-[var(--color-rt-primary)]/20' : 'text-gray-600 hover:bg-gray-100'"
        >
          {{ cat }}
        </button>
      </div>

      <div v-if="moduleStore.loading" class="flex justify-center py-20">
        <LoadingSpinner size="lg" text="Memuat modul..." />
      </div>

      <template v-else>
        <!-- Modules Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div
            v-for="(module, index) in (moduleStore.modules.length > 0 ? moduleStore.modules : sampleModules)"
            :key="module.id"
            v-animate
            :class="`delay-${(index % 6) * 100}`"
            class="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-lg shadow-[var(--color-rt-primary)]/5 hover:-translate-y-2 transition-transform duration-300 flex flex-col group relative"
          >
            <!-- Badge -->
            <div class="absolute top-6 right-6">
              <span class="bg-[var(--color-rt-light-alt)] text-[var(--color-rt-secondary)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {{ module.category || 'Modul' }}
              </span>
            </div>

            <div class="w-16 h-16 rounded-2xl bg-[var(--color-rt-accent)]/20 text-[var(--color-rt-primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9h6v9h-6zm6-13c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1s1-.45 1-1V4.5c0-.55-.45-1-1-1z" opacity="0.3"/>
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </div>
            
            <h3 class="font-bold text-[var(--color-rt-dark)] text-xl leading-snug mb-3 pr-16" style="font-family: var(--font-serif);">
              {{ module.title }}
            </h3>
            
            <p class="text-sm text-gray-600 mb-8 flex-1 leading-relaxed">
              {{ module.description }}
            </p>
            
            <div class="mt-auto">
              <div class="flex items-center gap-4 text-sm text-gray-500 mb-6 font-medium">
                <span class="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ module.file_size || 'Unknown' }}
                </span>
                <span class="flex items-center gap-1.5 text-[var(--color-rt-secondary)]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {{ module.download_count || 0 }} unduhan
                </span>
              </div>

              <button
                @click="handleDownload(module)"
                class="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-[var(--color-rt-primary)] hover:bg-[var(--color-rt-primary-light)] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-rt-primary)]/20 hover:shadow-[var(--color-rt-primary)]/40"
              >
                Unduh Modul
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="moduleStore.modules.length === 0 && selectedCategory !== 'Semua'" class="text-center py-20">
          <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400 rotate-12">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-[var(--color-rt-dark)] mb-2" style="font-family: var(--font-serif);">Belum ada modul</h3>
          <p class="text-gray-500">
            Belum ada modul yang diunggah dalam kategori "{{ selectedCategory }}".
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
