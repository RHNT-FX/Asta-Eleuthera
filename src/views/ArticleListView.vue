<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const articleStore = useArticleStore()
const searchQuery = ref('')
const selectedCategory = ref('Semua')
const currentPage = ref(1)
const itemsPerPage = 6

const sampleArticles = [
  {
    id: '1',
    slug: 'kegiatan-kerja-bakti-mingguan',
    title: 'Kegiatan Kerja Bakti Rutin Warga RT 27',
    excerpt: 'Kerja bakti pembersihan selokan dan lingkungan sekitar yang diikuti oleh seluruh warga RT 27 berjalan dengan lancar.',
    category: 'Kegiatan',
    created_at: new Date().toISOString(),
    thumbnail_url: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=600',
    author_name: 'Admin RT'
  },
  {
    id: '2',
    slug: 'pengumuman-iuran-bulanan',
    title: 'Pengumuman Iuran Bulanan Bulan Ini',
    excerpt: 'Diberitahukan kepada seluruh warga bahwa iuran bulanan untuk bulan ini sudah dapat diserahkan kepada bendahara RT.',
    category: 'Pengumuman',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    thumbnail_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    author_name: 'Bendahara'
  },
  {
    id: '3',
    slug: 'tips-menjaga-kesehatan-lingkungan',
    title: 'Tips Menjaga Kesehatan Lingkungan Sekitar',
    excerpt: 'Beberapa cara mudah yang bisa kita lakukan bersama untuk menjaga lingkungan RT 27 tetap bersih dan sehat.',
    category: 'Edukasi',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    thumbnail_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15f?w=600',
    author_name: 'Admin RT'
  }
]

async function loadArticles() {
  await articleStore.fetchArticles({
    page: currentPage.value,
    limit: itemsPerPage,
    category: selectedCategory.value,
    search: searchQuery.value
  })
}

onMounted(() => {
  loadArticles()
})

let debounceTimer
watch([searchQuery, selectedCategory], () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    loadArticles()
  }, 300)
})

function nextPage() {
  if (currentPage.value * itemsPerPage < articleStore.totalCount) {
    currentPage.value++
    loadArticles()
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadArticles()
  }
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString))
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-rt-light)] pb-24">
    <!-- Header -->
    <div class="bg-white pt-32 pb-12 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <h1 v-animate class="text-4xl md:text-5xl font-bold text-[var(--color-rt-dark)] mb-6" style="font-family: var(--font-serif);">
          Artikel & Berita
        </h1>
        <p v-animate class="delay-100 text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
          Kumpulan berita, pengumuman, dan informasi edukasi seputar lingkungan RT 27.
        </p>

        <!-- Search & Filter -->
        <div v-animate class="delay-200 max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
          <div class="relative flex-1">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Cari artikel..." 
              class="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[var(--color-rt-primary)] focus:ring-2 focus:ring-[var(--color-rt-primary)]/20 outline-none transition-all shadow-sm"
            />
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
            <button 
              @click="selectedCategory = 'Semua'"
              class="px-5 py-3.5 rounded-xl font-medium whitespace-nowrap transition-colors"
              :class="selectedCategory === 'Semua' ? 'bg-[var(--color-rt-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              Semua
            </button>
            <button 
              v-for="cat in articleStore.categories" 
              :key="cat"
              @click="selectedCategory = cat"
              class="px-5 py-3.5 rounded-xl font-medium whitespace-nowrap transition-colors"
              :class="selectedCategory === cat ? 'bg-[var(--color-rt-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-6 mt-16">
      <div v-if="articleStore.loading" class="flex justify-center py-20">
        <LoadingSpinner size="lg" text="Memuat artikel..." />
      </div>

      <template v-else>
        <!-- Articles Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="(article, index) in (articleStore.articles.length > 0 ? articleStore.articles : sampleArticles)"
            :key="article.id"
            v-animate
            :class="`delay-${(index % 6) * 100}`"
            class="bg-white rounded-3xl overflow-hidden card-hover shadow-lg shadow-gray-200/50 flex flex-col group border border-gray-50"
          >
            <!-- Thumbnail -->
            <div class="relative h-56 overflow-hidden">
              <img
                v-if="article.thumbnail_url"
                :src="article.thumbnail_url"
                :alt="article.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-[var(--color-rt-primary)] to-[var(--color-rt-secondary)]"></div>
              
              <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[var(--color-rt-primary)] shadow-sm">
                {{ article.category || 'Umum' }}
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex flex-col flex-1">
              <div class="flex items-center justify-between text-xs text-gray-500 mb-3 font-medium">
                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDate(article.created_at) }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-[var(--color-rt-secondary)]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ article.author_name || 'Admin' }}</span>
                </div>
              </div>

              <h3 class="text-xl font-bold text-[var(--color-rt-dark)] mb-3 line-clamp-2 leading-snug group-hover:text-[var(--color-rt-primary)] transition-colors" style="font-family: var(--font-serif);">
                <RouterLink :to="`/artikel/${article.slug}`" class="focus:outline-none">
                  {{ article.title }}
                </RouterLink>
              </h3>

              <p class="text-gray-600 mb-6 line-clamp-2 text-sm flex-1 leading-relaxed">
                {{ article.excerpt }}
              </p>

              <div class="mt-auto pt-4 border-t border-gray-100">
                <RouterLink
                  :to="`/artikel/${article.slug}`"
                  class="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-rt-primary)] group-hover:text-[var(--color-rt-secondary)] transition-colors"
                >
                  Baca Selengkapnya
                  <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </RouterLink>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-if="articleStore.articles.length === 0" class="text-center py-20">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7H20" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-[var(--color-rt-dark)] mb-2" style="font-family: var(--font-serif);">Belum ada artikel</h3>
          <p class="text-gray-500">
            <span v-if="searchQuery">Tidak ada artikel yang cocok dengan pencarian "{{ searchQuery }}".</span>
            <span v-else>Belum ada artikel yang dipublikasikan dalam kategori ini.</span>
          </p>
        </div>

        <!-- Pagination -->
        <div v-if="articleStore.totalCount > itemsPerPage" class="flex justify-center items-center gap-4 mt-16">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-sm font-medium text-gray-600">
            Halaman {{ currentPage }} dari {{ Math.ceil(articleStore.totalCount / itemsPerPage) }}
          </span>
          <button 
            @click="nextPage"
            :disabled="currentPage * itemsPerPage >= articleStore.totalCount"
            class="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
