<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useModuleStore } from '@/stores/module'

const moduleStore = useModuleStore()
const latestModules = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const modules = await moduleStore.fetchModules()
    latestModules.value = modules ? modules.slice(0, 3) : []
  } catch (error) {
    console.error(error)
    latestModules.value = []
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

        <div v-else-if="latestModules.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          <div
            v-for="(module, index) in latestModules"
            :key="module.id"
            v-animate
            :class="`delay-${index * 100}`"
            class="bg-white rounded-3xl p-6 lg:p-8 shadow-xl shadow-[var(--color-rt-primary)]/5 hover:-translate-y-2 transition-transform duration-300 flex flex-col group border border-gray-100"
          >
            <!-- Badge -->
            <div class="absolute top-6 right-6">
              <span class="bg-[var(--color-rt-light-alt)] text-[var(--color-rt-secondary)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {{ module.category || 'Modul' }}
              </span>
            </div>

            <!-- Icon -->
            <div class="w-14 h-14 rounded-2xl bg-[var(--color-rt-accent)]/20 text-[var(--color-rt-primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
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
            
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <div class="flex items-center gap-4 text-xs font-medium text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  {{ module.file_size || '0 MB' }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  {{ module.download_count || 0 }} unduhan
                </span>
              </div>
            </div>

            <!-- Hover overlay button -->
            <button 
              @click="handleDownload(module)"
              class="absolute inset-x-6 bottom-6 bg-[var(--color-rt-primary)] text-white py-3 rounded-xl font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-[var(--color-rt-primary)]/20 flex items-center justify-center gap-2"
            >
              Unduh Modul
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <div v-else class="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
          <p class="text-gray-500">Belum ada modul pelatihan yang tersedia.</p>
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
