<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { useModuleStore } from '@/stores/module'

const articleStore = useArticleStore()
const moduleStore = useModuleStore()

const stats = ref({
  totalArticles: 0,
  publishedArticles: 0,
  totalModules: 0,
  totalDownloads: 0
})
const loading = ref(true)

onMounted(async () => {
  try {
    const [articleStats, moduleStats] = await Promise.all([
      articleStore.getStats(),
      moduleStore.getStats()
    ])
    
    stats.value = {
      totalArticles: articleStats.total || 0,
      publishedArticles: articleStats.published || 0,
      totalModules: moduleStats.total || 0,
      totalDownloads: moduleStats.totalDownloads || 0
    }
  } catch (error) {
    console.error('Failed to load stats', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-[var(--color-rt-dark)]">Selamat Datang, Admin!</h1>
      <p class="text-gray-500 text-sm mt-1">Berikut adalah ringkasan data portal warga RT 27 hari ini.</p>
    </div>

    <!-- Stats Grid -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div v-for="i in 4" :key="i" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-32"></div>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <!-- Stat 1 -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="w-14 h-14 rounded-xl bg-[var(--color-rt-primary)]/10 text-[var(--color-rt-primary)] flex items-center justify-center flex-shrink-0">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">Total Artikel</p>
          <p class="text-2xl font-bold text-[var(--color-rt-dark)]">{{ stats.totalArticles }}</p>
        </div>
      </div>

      <!-- Stat 2 -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="w-14 h-14 rounded-xl bg-[var(--color-rt-accent)]/20 text-[var(--color-rt-primary)] flex items-center justify-center flex-shrink-0">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">Artikel Publik</p>
          <p class="text-2xl font-bold text-[var(--color-rt-dark)]">{{ stats.publishedArticles }}</p>
        </div>
      </div>

      <!-- Stat 3 -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="w-14 h-14 rounded-xl bg-[var(--color-rt-primary)]/10 text-[var(--color-rt-primary)] flex items-center justify-center flex-shrink-0">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">Total Modul</p>
          <p class="text-2xl font-bold text-[var(--color-rt-dark)]">{{ stats.totalModules }}</p>
        </div>
      </div>

      <!-- Stat 4 -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="w-14 h-14 rounded-xl bg-[var(--color-rt-accent)]/20 text-[var(--color-rt-primary)] flex items-center justify-center flex-shrink-0">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">Total Unduhan</p>
          <p class="text-2xl font-bold text-[var(--color-rt-dark)]">{{ stats.totalDownloads }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-lg font-bold text-[var(--color-rt-dark)] mb-4">Aksi Cepat</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RouterLink 
          to="/admin/artikel"
          class="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[var(--color-rt-primary)] hover:shadow-md transition-all flex items-center justify-between"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-[var(--color-rt-primary)]/10 text-[var(--color-rt-primary)] flex items-center justify-center group-hover:bg-[var(--color-rt-primary)] group-hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-[var(--color-rt-dark)]">Tulis Artikel Baru</h3>
              <p class="text-sm text-gray-500 mt-0.5">Buat pengumuman atau berita terbaru</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400 group-hover:text-[var(--color-rt-primary)] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>

        <RouterLink 
          to="/admin/modul"
          class="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[var(--color-rt-primary)] hover:shadow-md transition-all flex items-center justify-between"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-[var(--color-rt-accent)]/20 text-[var(--color-rt-primary)] flex items-center justify-center group-hover:bg-[var(--color-rt-primary)] group-hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-[var(--color-rt-dark)]">Upload Modul</h3>
              <p class="text-sm text-gray-500 mt-0.5">Tambah materi pelatihan baru</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400 group-hover:text-[var(--color-rt-primary)] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
