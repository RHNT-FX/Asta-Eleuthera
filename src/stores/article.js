import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useArticleStore = defineStore('article', () => {
  const articles = ref([])
  const currentArticle = ref(null)
  const loading = ref(false)
  const totalCount = ref(0)
  const categories = ref(['Pengumuman', 'Kegiatan', 'Info Warga', 'Edukasi', 'Umum'])

  const publishedArticles = computed(() =>
    articles.value.filter((a) => a.is_published),
  )

  async function fetchArticles({ page = 1, limit = 9, category = null, search = null } = {}) {
    loading.value = true
    try {
      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (category && category !== 'Semua') {
        query = query.eq('category', category)
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
      }

      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query
      if (error) throw error

      articles.value = data || []
      totalCount.value = count || 0
      return { data, count }
    } catch (error) {
      console.error('Fetch articles error:', error)
      return { data: [], count: 0 }
    } finally {
      loading.value = false
    }
  }

  async function fetchAllArticles() {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      articles.value = data || []
      return data
    } catch (error) {
      console.error('Fetch all articles error:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchBySlug(slug) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      currentArticle.value = data

      // Increment views
      if (data) {
        supabase
          .from('articles')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id)
          .then()
      }

      return data
    } catch (error) {
      console.error('Fetch article by slug error:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchLatest(limit = 3) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Fetch latest articles error:', error)
      return []
    }
  }

  async function createArticle(article) {
    loading.value = true
    try {
      const slug = article.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      const { data, error } = await supabase
        .from('articles')
        .insert([{ ...article, slug }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  async function updateArticle(id, updates) {
    loading.value = true
    try {
      if (updates.title) {
        updates.slug = updates.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      }
      updates.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  async function deleteArticle(id) {
    loading.value = true
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id)
      if (error) throw error
      articles.value = articles.value.filter((a) => a.id !== id)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  async function uploadThumbnail(file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `thumbnails/${fileName}`

    const { error } = await supabase.storage
      .from('article-thumbnails')
      .upload(filePath, file)

    if (error) throw error

    const { data } = supabase.storage
      .from('article-thumbnails')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  async function getStats() {
    try {
      const { count: total } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })

      const { count: published } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)

      const { data: viewsData } = await supabase
        .from('articles')
        .select('views')

      const totalViews = (viewsData || []).reduce((sum, a) => sum + (a.views || 0), 0)

      return { total, published, totalViews }
    } catch (error) {
      console.error('Get stats error:', error)
      return { total: 0, published: 0, totalViews: 0 }
    }
  }

  return {
    articles,
    currentArticle,
    loading,
    totalCount,
    categories,
    publishedArticles,
    fetchArticles,
    fetchAllArticles,
    fetchBySlug,
    fetchLatest,
    createArticle,
    updateArticle,
    deleteArticle,
    uploadThumbnail,
    getStats,
  }
})
