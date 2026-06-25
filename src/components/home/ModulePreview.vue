<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useModuleStore } from '@/stores/module'

const moduleStore = useModuleStore()
const latestModules = ref([])
const loading = ref(true)

const sampleModules = [
  {
    id: '1',
    title: 'Panduan Budidaya Bawang Dayak',
    description: 'Modul lengkap cara menanam, merawat, dan memanen bawang dayak di pekarangan rumah.',
    file_size: '2.4 MB',
    download_count: 145,
    category: 'Panduan'
  },
  {
    id: '2',
    title: 'Manfaat Kesehatan Bawang Dayak',
    description: 'Edukasi mengenai berbagai manfaat bawang dayak untuk kesehatan dan cara pengolahannya.',
    file_size: '1.8 MB',
    download_count: 89,
    category: 'Edukasi'
  },
  {
    id: '3',
    title: 'Pembuatan Pupuk Kompos',
    description: 'Cara membuat pupuk kompos organik sendiri dari limbah rumah tangga.',
    file_size: '3.1 MB',
    download_count: 210,
    category: 'Panduan'
  }
]

onMounted(async () => {
  try {
    const modules = await moduleStore.fetchModules()
    latestModules.value = modules && modules.length > 0 ? modules.slice(0, 3) : sampleModules
  } catch (error) {
    console.error(error)
    latestModules.value = sampleModules
  } finally {
    loading.value = false
  }
})

function handleDownload(module) {
  // In a real scenario, this would call incrementDownload and then open the file
  if (module.file_url) {
    window.open(module.file_url, '_blank')
  }
}
</script>

<template>
  <section class="py-24 bg-white relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-rt-light-alt)]/50 rounded-l-[100px] pointer-events-none -z-10"></div>
    
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div v-animate class="flex items-center justify-center gap-3 mb-4">
          <span class="w-12 h-1 bg-[var(--color-rt-accent)] rounded-full"></span>
          <span class="text-[var(--color-rt-primary)] font-bold tracking-wider uppercase text-sm">Pusat Edukasi</span>
          <span class="w-12 h-1 bg-[var(--color-rt-accent)] rounded-full"></span>
        </div>
        <h2 v-animate class="delay-100 text-3xl sm:text-4xl font-bold text-[var(--color-rt-dark)] mb-6 leading-tight">
          Modul Pelatihan
        </h2>
        <p v-animate class="delay-200 text-gray-600 text-lg">
          Download modul pelatihan penanaman bawang dayak dan materi edukasi lainnya yang disediakan oleh pengurus RT 27.
        </p>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="animate-pulse bg-gray-100 rounded-3xl h-48"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(module, index) in latestModules"
          :key="module.id"
          v-animate
          :class="`delay-${index * 100}`"
          class="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg shadow-[var(--color-rt-primary)]/5 hover:-translate-y-2 transition-transform duration-300 flex flex-col group relative overflow-hidden"
        >
          <!-- Accent top line -->
          <div class="absolute top-0 left-0 w-full h-1 bg-[var(--color-rt-primary)]"></div>
          
          <div class="flex items-start gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-[var(--color-rt-accent)]/20 text-[var(--color-rt-primary)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9h6v9h-6zm6-13c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1s1-.45 1-1V4.5c0-.55-.45-1-1-1z" opacity="0.3"/>
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-[var(--color-rt-dark)] text-lg leading-tight mb-1" style="font-family: var(--font-serif);">
                {{ module.title }}
              </h3>
              <div class="flex items-center gap-3 text-xs text-gray-500">
                <span class="bg-gray-100 px-2 py-1 rounded-md">{{ module.file_size || 'Unknown' }}</span>
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {{ module.download_count || 0 }}
                </span>
              </div>
            </div>
          </div>
          
          <p class="text-sm text-gray-600 mb-6 flex-1">
            {{ module.description }}
          </p>
          
          <button
            @click="handleDownload(module)"
            class="w-full py-2.5 rounded-xl text-sm font-semibold text-[var(--color-rt-primary)] bg-[var(--color-rt-primary)]/10 hover:bg-[var(--color-rt-primary)] hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Download PDF
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      <div v-animate class="delay-400 mt-12 text-center">
        <RouterLink
          to="/modul"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-[var(--color-rt-primary)] bg-white border border-[var(--color-rt-primary)] hover:bg-[var(--color-rt-primary)] hover:text-white transition-all duration-300"
        >
          Lihat Semua Modul
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
