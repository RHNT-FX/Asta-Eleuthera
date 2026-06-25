import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useModuleStore = defineStore('module', () => {
  const modules = ref([])
  const loading = ref(false)
  const categories = ref(['Pelatihan', 'Panduan', 'Materi', 'Lainnya'])

  async function fetchModules({ category = null } = {}) {
    loading.value = true
    try {
      let query = supabase
        .from('modules')
        .select('*')
        .order('created_at', { ascending: false })

      if (category && category !== 'Semua') {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (error) throw error
      modules.value = data || []
      return data
    } catch (error) {
      console.error('Fetch modules error:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  async function createModule(moduleData, file) {
    loading.value = true
    try {
      // Upload file
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `files/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('modules')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('modules')
        .getPublicUrl(filePath)

      // Format file size
      const fileSize = formatFileSize(file.size)

      const { data, error } = await supabase
        .from('modules')
        .insert([{
          ...moduleData,
          file_url: urlData.publicUrl,
          file_size: fileSize,
        }])
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

  async function updateModule(id, updates) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('modules')
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

  async function deleteModule(id) {
    loading.value = true
    try {
      const { error } = await supabase.from('modules').delete().eq('id', id)
      if (error) throw error
      modules.value = modules.value.filter((m) => m.id !== id)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  async function incrementDownload(id, currentCount) {
    try {
      await supabase
        .from('modules')
        .update({ download_count: (currentCount || 0) + 1 })
        .eq('id', id)
    } catch (error) {
      console.error('Increment download error:', error)
    }
  }

  async function getStats() {
    try {
      const { count: total } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true })

      const { data: dlData } = await supabase
        .from('modules')
        .select('download_count')

      const totalDownloads = (dlData || []).reduce((sum, m) => sum + (m.download_count || 0), 0)

      return { total, totalDownloads }
    } catch (error) {
      return { total: 0, totalDownloads: 0 }
    }
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return {
    modules,
    loading,
    categories,
    fetchModules,
    createModule,
    updateModule,
    deleteModule,
    incrementDownload,
    getStats,
    formatFileSize,
  }
})
