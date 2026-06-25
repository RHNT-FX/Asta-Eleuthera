<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useArticleStore } from '@/stores/article'

const articleStore = useArticleStore()
const latestArticles = ref([])
const loading = ref(true)

const sampleArticles = [
  {
    id: '1',
    slug: 'kegiatan-kerja-bakti-mingguan',
    title: 'Kegiatan Kerja Bakti Rutin Warga RT 27',
    excerpt: 'Kerja bakti pembersihan selokan dan lingkungan sekitar yang diikuti oleh seluruh warga RT 27 berjalan dengan lancar.',
    category: 'Kegiatan',
    created_at: new Date().toISOString(),
    thumbnail_url: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=600'
  },
  {
    id: '2',
    slug: 'pengumuman-iuran-bulanan',
    title: 'Pengumuman Iuran Bulanan Bulan Ini',
    excerpt: 'Diberitahukan kepada seluruh warga bahwa iuran bulanan untuk bulan ini sudah dapat diserahkan kepada bendahara RT.',
    category: 'Pengumuman',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    thumbnail_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'
  },
  {
    id: '3',
    slug: 'tips-menjaga-kesehatan-lingkungan',
    title: 'Tips Menjaga Kesehatan Lingkungan Sekitar',
    excerpt: 'Beberapa cara mudah yang bisa kita lakukan bersama untuk menjaga lingkungan RT 27 tetap bersih dan sehat.',
    category: 'Edukasi',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    thumbnail_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15f?w=600'
  }
]

onMounted(async () => {
  try {
    const articles = await articleStore.fetchLatest(3)
    latestArticles.value = articles && articles.length > 0 ? articles : sampleArticles
  } catch (error) {
    console.error(error)
    latestArticles.value = sampleArticles
  } finally {
    loading.value = false
  }
})

function formatDate(dateString) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString))
}
</script>

<template>
  <section class="py-24 bg-[var(--color-rt-light-alt)]">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div v-animate>
          <div class="flex items-center gap-3 mb-4">
            <span class="w-12 h-1 bg-[var(--color-rt-accent)] rounded-full"></span>
            <span class="text-[var(--color-rt-primary)] font-bold tracking-wider uppercase text-sm">Informasi & Berita</span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-[var(--color-rt-dark)] leading-tight">
            Artikel Terbaru
          </h2>
        </div>
        <div v-animate class="delay-100">
          <RouterLink
            to="/artikel"
            class="group flex items-center gap-2 text-[var(--color-rt-primary)] font-semibold hover:text-[var(--color-rt-secondary)] transition-colors"
          >
            Lihat Semua Artikel
            <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </RouterLink>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="animate-pulse bg-white rounded-3xl h-[400px]"></div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="(article, index) in latestArticles"
          :key="article.id"
          v-animate
          :class="`delay-${index * 100}`"
          class="bg-white rounded-3xl overflow-hidden card-hover shadow-lg shadow-gray-200/50 flex flex-col group"
        >
          <!-- Thumbnail -->
          <div class="relative h-56 overflow-hidden">
            <img
              v-if="article.thumbnail_url"
              :src="article.thumbnail_url"
              :alt="article.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-[var(--color-rt-primary)] to-[var(--color-rt-secondary)] flex items-center justify-center">
              <svg class="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--color-rt-primary)]">
              {{ article.category || 'Umum' }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 flex flex-col flex-1">
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDate(article.created_at) }}</span>
            </div>

            <h3 class="text-xl font-bold text-[var(--color-rt-dark)] mb-3 line-clamp-2" style="font-family: var(--font-serif);">
              <RouterLink :to="`/artikel/${article.slug}`" class="hover:text-[var(--color-rt-primary)] transition-colors">
                {{ article.title }}
              </RouterLink>
            </h3>

            <p class="text-gray-600 mb-6 line-clamp-2 text-sm flex-1">
              {{ article.excerpt }}
            </p>

            <div class="mt-auto pt-4 border-t border-gray-100">
              <RouterLink
                :to="`/artikel/${article.slug}`"
                class="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-rt-primary)] hover:text-[var(--color-rt-secondary)] transition-colors"
              >
                Baca Selengkapnya
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </RouterLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
