import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useProfileStore = defineStore('profile', () => {
  const profileData = ref({})
  const gallery = ref([])
  const loading = ref(false)

  // Default placeholder data (dipakai sebelum Supabase terkoneksi)
  const defaults = {
    visi_misi: {
      visi: 'Mewujudkan lingkungan RT 27 yang bersih, aman, nyaman, dan gotong royong untuk kesejahteraan bersama.',
      misi: [
        'Meningkatkan keamanan dan ketertiban lingkungan',
        'Membangun semangat gotong royong antar warga',
        'Menjaga kebersihan dan keindahan lingkungan',
        'Memfasilitasi kegiatan sosial dan keagamaan warga',
        'Mendorong partisipasi warga dalam pembangunan',
      ],
    },
    sejarah: {
      content:
        'RT 27 merupakan salah satu rukun tetangga yang berada di wilayah Kalimantan Timur. Didirikan sebagai bagian dari upaya penataan administrasi kependudukan, RT 27 telah berkembang menjadi komunitas yang solid dengan semangat gotong royong yang tinggi. Berbagai kegiatan sosial, keagamaan, dan pembangunan telah dilaksanakan oleh warga RT 27 untuk meningkatkan kualitas hidup bersama.',
      established_year: '2010',
    },
    pengurus: [
      { nama: 'Ketua RT', jabatan: 'Ketua RT', foto: null },
      { nama: 'Wakil Ketua', jabatan: 'Wakil Ketua RT', foto: null },
      { nama: 'Sekretaris', jabatan: 'Sekretaris', foto: null },
      { nama: 'Bendahara', jabatan: 'Bendahara', foto: null },
    ],
    kontak: {
      phone: '+62 812-3456-7890',
      email: 'rt27@example.com',
      whatsapp: '6281234567890',
      address: 'RT 27, Kalimantan Timur',
    },
    alamat: {
      lat: -1.2654,
      lng: 116.8312,
      address: 'RT 27, Kalimantan Timur',
    },
  }

  async function fetchProfile() {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('profile_settings')
        .select('*')

      if (error) throw error

      if (data && data.length > 0) {
        data.forEach((item) => {
          profileData.value[item.key] = item.value
        })
      } else {
        // Use defaults if no data in DB
        profileData.value = { ...defaults }
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
      profileData.value = { ...defaults }
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(key, value) {
    loading.value = true
    try {
      const { error } = await supabase
        .from('profile_settings')
        .upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: 'key' },
        )

      if (error) throw error
      profileData.value[key] = value
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  async function fetchGallery() {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      gallery.value = data || []
      return data
    } catch (error) {
      console.error('Fetch gallery error:', error)
      return []
    }
  }

  async function addGalleryImage(imageFile, caption = '', category = 'kegiatan') {
    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `gallery/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, imageFile)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      const { data, error } = await supabase
        .from('gallery')
        .insert([{
          image_url: urlData.publicUrl,
          caption,
          category,
        }])
        .select()
        .single()

      if (error) throw error
      gallery.value.unshift(data)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async function deleteGalleryImage(id) {
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (error) throw error
      gallery.value = gallery.value.filter((g) => g.id !== id)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  function getProfileValue(key) {
    return profileData.value[key] || defaults[key] || null
  }

  return {
    profileData,
    gallery,
    loading,
    defaults,
    fetchProfile,
    updateProfile,
    fetchGallery,
    addGalleryImage,
    deleteGalleryImage,
    getProfileValue,
  }
})
