<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { marked } from 'marked'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const articleStore = useArticleStore()
const notFound = ref(false)

const article = computed(() => articleStore.currentArticle)
const parsedContent = computed(() => {
  if (!article.value?.content) return ''
  return marked(article.value.content)
})

onMounted(async () => {
  const slug = route.params.slug
  const data = await articleStore.fetchBySlug(slug)
  if (!data) {
    notFound.value = true
  }
})

function formatDate(dateString) {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString))
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  alert('Tautan berhasil disalin!')
}

const currentUrl = computed(() => encodeURIComponent(window.location.href))
const shareText = computed(() => encodeURIComponent(article.value?.title || 'Artikel RT 27'))
</script>

<template>
  <div class="min-h-screen bg-[var(--color-rt-light)] pt-32 pb-24">
    <div class="max-w-4xl mx-auto px-6">
      
      <div v-if="articleStore.loading" class="flex justify-center py-32">
        <LoadingSpinner size="lg" text="Memuat artikel..." />
      </div>

      <div v-else-if="notFound" class="text-center py-32">
        <h2 class="text-3xl font-bold text-[var(--color-rt-dark)] mb-4" style="font-family: var(--font-serif);">Artikel Tidak Ditemukan</h2>
        <p class="text-gray-600 mb-8">Maaf, artikel yang Anda cari tidak ada atau telah dihapus.</p>
        <RouterLink to="/artikel" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-[var(--color-rt-primary)] hover:bg-[var(--color-rt-primary-light)] transition-colors">
          Kembali ke Daftar Artikel
        </RouterLink>
      </div>

      <article v-else-if="article" class="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/50">
        <!-- Back Link -->
        <RouterLink to="/artikel" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[var(--color-rt-primary)] transition-colors mb-8">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </RouterLink>

        <!-- Category Badge -->
        <div class="mb-6">
          <span class="inline-block bg-[var(--color-rt-accent)]/20 text-[var(--color-rt-primary)] px-4 py-1.5 rounded-full text-sm font-bold">
            {{ article.category || 'Umum' }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-rt-dark)] leading-tight mb-6" style="font-family: var(--font-serif);">
          {{ article.title }}
        </h1>

        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-10 pb-8 border-b border-gray-100 font-medium">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-[var(--color-rt-primary)] text-white flex items-center justify-center font-bold text-xs">
              {{ (article.author_name || 'A')[0].toUpperCase() }}
            </div>
            <span class="text-[var(--color-rt-dark)]">{{ article.author_name || 'Admin RT' }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(article.created_at) }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{{ article.views || 0 }} dibaca</span>
          </div>
        </div>

        <!-- Thumbnail -->
        <div v-if="article.thumbnail_url" class="relative rounded-[2rem] overflow-hidden mb-12 shadow-lg">
          <img :src="article.thumbnail_url" :alt="article.title" class="w-full h-auto max-h-[500px] object-cover" />
        </div>

        <!-- Content -->
        <div class="article-content text-lg" v-html="parsedContent"></div>

        <!-- Share Actions -->
        <div class="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <span class="font-bold text-[var(--color-rt-dark)]">Bagikan artikel ini:</span>
          <div class="flex items-center gap-3">
            <a 
              :href="`https://wa.me/?text=${shareText}%20${currentUrl}`" 
              target="_blank" 
              class="w-10 h-10 rounded-full bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors"
              title="Bagikan ke WhatsApp"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a 
              :href="`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`" 
              target="_blank" 
              class="w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
              title="Bagikan ke Facebook"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <button 
              @click="copyLink" 
              class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              title="Salin Tautan"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
