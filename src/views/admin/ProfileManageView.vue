<script setup>
import { ref, onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useToastStore } from '@/stores/toast'

const profileStore = useProfileStore()
const toast = useToastStore()
const activeTab = ref('visiMisi')
const saving = ref(false)

// Forms Data (cloned from store on mount to allow editing without immediate save)
const visiMisi = ref({ visi: '', misi: [] })
const sejarah = ref({ content: '', established_year: '' })
const pengurus = ref([])
const kontak = ref({ whatsapp: '', email: '', phone: '', address: '', lat: -1.2654, lng: 116.8312 })
const gallery = ref([])

// Gallery Upload state
const galleryFile = ref(null)
const galleryCaption = ref('')

onMounted(async () => {
  await Promise.all([
    profileStore.fetchProfile(),
    profileStore.fetchGallery()
  ])
  
  // Clone data
  visiMisi.value = JSON.parse(JSON.stringify(profileStore.getProfileValue('visi_misi') || { visi: '', misi: [''] }))
  sejarah.value = JSON.parse(JSON.stringify(profileStore.getProfileValue('sejarah') || { content: '', established_year: '' }))
  pengurus.value = JSON.parse(JSON.stringify(profileStore.getProfileValue('pengurus') || []))
  kontak.value = JSON.parse(JSON.stringify(profileStore.getProfileValue('kontak') || { whatsapp: '', email: '', phone: '', address: '', lat: -1.2654, lng: 116.8312 }))
  gallery.value = profileStore.gallery || []
})

// Misi Actions
function addMisi() { visiMisi.value.misi.push('') }
function removeMisi(index) { visiMisi.value.misi.splice(index, 1) }

// Pengurus Actions
function addPengurus() { pengurus.value.push({ nama: '', jabatan: '', foto: '' }) }
function removePengurus(index) { pengurus.value.splice(index, 1) }

// Save Handlers
async function handleSaveProfile(key, data, successMessage) {
  saving.value = true
  try {
    const result = await profileStore.updateProfile(key, data)
    if (result.success) {
      toast.showToast(successMessage, 'success')
    } else {
      toast.showToast('Gagal menyimpan: ' + (result.error || 'Unknown error'), 'error')
    }
  } catch (error) {
    toast.showToast('Terjadi kesalahan saat menyimpan', 'error')
  } finally {
    saving.value = false
  }
}

async function saveVisiMisi() {
  await handleSaveProfile('visi_misi', visiMisi.value, 'Visi Misi berhasil disimpan!')
}

async function saveSejarah() {
  await handleSaveProfile('sejarah', sejarah.value, 'Sejarah berhasil disimpan!')
}

async function savePengurus() {
  await handleSaveProfile('pengurus', pengurus.value, 'Struktur Pengurus berhasil disimpan!')
}

async function saveKontak() {
  await handleSaveProfile('kontak', kontak.value, 'Kontak & Alamat berhasil disimpan!')
}

// Gallery Handlers
function handleGalleryFile(event) {
  const file = event.target.files[0]
  if (file) {
    galleryFile.value = file
  }
}

async function uploadGallery() {
  if (!galleryFile.value) {
    toast.showToast('Pilih foto terlebih dahulu', 'error')
    return
  }
  
  saving.value = true
  try {
    const result = await profileStore.addGalleryImage(galleryFile.value, galleryCaption.value)
    if (result.success) {
      toast.showToast('Foto berhasil ditambahkan ke galeri', 'success')
      galleryFile.value = null
      galleryCaption.value = ''
      document.getElementById('galleryInput').value = ''
      gallery.value = profileStore.gallery
    } else {
      toast.showToast('Gagal upload: ' + (result.error || 'Unknown error'), 'error')
    }
  } catch (error) {
    toast.showToast('Terjadi kesalahan saat upload foto', 'error')
  } finally {
    saving.value = false
  }
}

async function deleteGallery(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) return
  
  const result = await profileStore.deleteGalleryImage(id)
  if (result.success) {
    toast.showToast('Foto berhasil dihapus', 'success')
    gallery.value = profileStore.gallery
  } else {
    toast.showToast('Gagal menghapus foto', 'error')
  }
}
</script>

<template>
  <div class="max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-[var(--color-rt-dark)]">Kelola Profil RT</h1>
      <p class="text-gray-500 text-sm mt-1">Perbarui informasi profil, sejarah, pengurus, dan kontak.</p>
    </div>

    <!-- Tabs -->
    <div class="flex overflow-x-auto hide-scrollbar gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
      <button 
        v-for="(label, key) in { visiMisi: 'Visi & Misi', sejarah: 'Sejarah', pengurus: 'Struktur Pengurus', kontak: 'Kontak & Alamat', galeri: 'Galeri Kegiatan' }" 
        :key="key"
        @click="activeTab = key"
        class="px-6 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap"
        :class="activeTab === key ? 'bg-[var(--color-rt-primary)] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
      >
        {{ label }}
      </button>
    </div>

    <!-- Tab Contents -->
    <div class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
      
      <!-- Visi Misi -->
      <form v-if="activeTab === 'visiMisi'" @submit.prevent="saveVisiMisi" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Visi</label>
          <textarea v-model="visiMisi.visi" rows="3" class="w-full rounded-xl border-gray-200 focus:border-[var(--color-rt-primary)] focus:ring-[var(--color-rt-primary)]/20 shadow-sm px-4 py-3 border text-gray-700" placeholder="Masukkan visi RT 27..."></textarea>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-bold text-gray-700">Misi</label>
            <button type="button" @click="addMisi" class="text-sm text-[var(--color-rt-primary)] hover:text-[var(--color-rt-primary-light)] font-medium flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Tambah Misi
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="(m, i) in visiMisi.misi" :key="i" class="flex gap-2">
              <span class="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-500">{{ i + 1 }}</span>
              <input v-model="visiMisi.misi[i]" type="text" class="flex-1 rounded-xl border-gray-200 focus:border-[var(--color-rt-primary)] focus:ring-[var(--color-rt-primary)]/20 shadow-sm px-4 border text-gray-700" placeholder="Pernyataan misi..." />
              <button type="button" @click="removeMisi(i)" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div class="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" :disabled="saving" class="bg-[var(--color-rt-primary)] text-white px-8 py-3 rounded-xl font-medium hover:bg-[var(--color-rt-primary-light)] transition-colors shadow-lg shadow-[var(--color-rt-primary)]/20">
            Simpan Perubahan
          </button>
        </div>
      </form>

      <!-- Sejarah -->
      <form v-if="activeTab === 'sejarah'" @submit.prevent="saveSejarah" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Tahun Berdiri</label>
          <input v-model="sejarah.established_year" type="text" class="w-full md:w-1/3 rounded-xl border-gray-200 focus:border-[var(--color-rt-primary)] focus:ring-[var(--color-rt-primary)]/20 shadow-sm px-4 py-3 border text-gray-700" placeholder="Contoh: 2010" />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Konten Sejarah</label>
          <textarea v-model="sejarah.content" rows="10" class="w-full rounded-xl border-gray-200 focus:border-[var(--color-rt-primary)] focus:ring-[var(--color-rt-primary)]/20 shadow-sm px-4 py-3 border text-gray-700 leading-relaxed"></textarea>
        </div>
        <div class="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" :disabled="saving" class="bg-[var(--color-rt-primary)] text-white px-8 py-3 rounded-xl font-medium hover:bg-[var(--color-rt-primary-light)] transition-colors shadow-lg shadow-[var(--color-rt-primary)]/20">
            Simpan Perubahan
          </button>
        </div>
      </form>

      <!-- Pengurus -->
      <form v-if="activeTab === 'pengurus'" @submit.prevent="savePengurus" class="space-y-6">
        <div class="flex items-center justify-between mb-4">
          <p class="text-gray-600 text-sm">Kelola susunan pengurus inti RT 27.</p>
          <button type="button" @click="addPengurus" class="bg-[var(--color-rt-light-alt)] text-[var(--color-rt-primary)] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Tambah Pengurus
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(p, i) in pengurus" :key="i" class="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative group">
            <button type="button" @click="removePengurus(i)" class="absolute top-4 right-4 p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label>
                <input v-model="pengurus[i].nama" type="text" class="w-full rounded-xl border-gray-200 px-3 py-2 border bg-white" placeholder="Nama..." />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Jabatan</label>
                <input v-model="pengurus[i].jabatan" type="text" class="w-full rounded-xl border-gray-200 px-3 py-2 border bg-white" placeholder="Ketua RT / Bendahara..." />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">URL Foto (Opsional)</label>
                <input v-model="pengurus[i].foto" type="url" class="w-full rounded-xl border-gray-200 px-3 py-2 border bg-white" placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>
        
        <div class="pt-6 border-t border-gray-100 flex justify-end">
          <button type="submit" :disabled="saving" class="bg-[var(--color-rt-primary)] text-white px-8 py-3 rounded-xl font-medium hover:bg-[var(--color-rt-primary-light)] transition-colors shadow-lg shadow-[var(--color-rt-primary)]/20">
            Simpan Perubahan
          </button>
        </div>
      </form>

      <!-- Kontak & Alamat -->
      <form v-if="activeTab === 'kontak'" @submit.prevent="saveKontak" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-6">
            <h3 class="font-bold text-[var(--color-rt-dark)] text-lg border-b pb-2">Sosial & Kontak</h3>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">WhatsApp</label>
              <input v-model="kontak.whatsapp" type="text" class="w-full rounded-xl border-gray-200 focus:border-[var(--color-rt-primary)] px-4 py-2 border" placeholder="628..." />
              <p class="text-xs text-gray-500 mt-1">Gunakan format 628... tanpa spasi/simbol</p>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input v-model="kontak.email" type="email" class="w-full rounded-xl border-gray-200 focus:border-[var(--color-rt-primary)] px-4 py-2 border" placeholder="rt27@..." />
            </div>
          </div>
          
          <div class="space-y-6">
            <h3 class="font-bold text-[var(--color-rt-dark)] text-lg border-b pb-2">Alamat & Peta</h3>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Alamat Lengkap</label>
              <textarea v-model="kontak.address" rows="2" class="w-full rounded-xl border-gray-200 px-4 py-2 border"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Latitude</label>
                <input v-model="kontak.lat" type="number" step="any" class="w-full rounded-xl border-gray-200 px-4 py-2 border" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Longitude</label>
                <input v-model="kontak.lng" type="number" step="any" class="w-full rounded-xl border-gray-200 px-4 py-2 border" />
              </div>
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-gray-100 flex justify-end">
          <button type="submit" :disabled="saving" class="bg-[var(--color-rt-primary)] text-white px-8 py-3 rounded-xl font-medium hover:bg-[var(--color-rt-primary-light)] transition-colors shadow-lg shadow-[var(--color-rt-primary)]/20">
            Simpan Perubahan
          </button>
        </div>
      </form>

      <!-- Galeri -->
      <div v-if="activeTab === 'galeri'" class="space-y-8">
        <!-- Upload Form -->
        <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <h3 class="font-bold text-[var(--color-rt-dark)] text-lg mb-4">Upload Foto Baru</h3>
          <form @submit.prevent="uploadGallery" class="flex flex-col sm:flex-row items-end gap-4">
            <div class="flex-1 w-full">
              <label class="block text-sm font-bold text-gray-700 mb-1">Pilih Foto</label>
              <input type="file" id="galleryInput" @change="handleGalleryFile" accept="image/*" class="w-full rounded-xl border-gray-200 bg-white px-4 py-2 border file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[var(--color-rt-primary)]/10 file:text-[var(--color-rt-primary)]" required />
            </div>
            <div class="flex-1 w-full">
              <label class="block text-sm font-bold text-gray-700 mb-1">Keterangan (Opsional)</label>
              <input v-model="galleryCaption" type="text" class="w-full rounded-xl border-gray-200 focus:border-[var(--color-rt-primary)] px-4 py-2 border bg-white" placeholder="Contoh: Kerja bakti 2024" />
            </div>
            <button type="submit" :disabled="saving" class="w-full sm:w-auto bg-[var(--color-rt-primary)] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[var(--color-rt-primary-light)] transition-colors shadow-sm disabled:opacity-50">
              {{ saving ? 'Mengunggah...' : 'Upload Foto' }}
            </button>
          </form>
        </div>

        <!-- Gallery Grid -->
        <div>
          <h3 class="font-bold text-[var(--color-rt-dark)] text-lg border-b pb-2 mb-4">Koleksi Foto</h3>
          
          <div v-if="gallery.length === 0" class="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            Belum ada foto di galeri. Upload foto pertama Anda di atas.
          </div>
          
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div v-for="item in gallery" :key="item.id" class="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 border border-gray-200">
              <img :src="item.image_url" :alt="item.caption" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                <p class="text-white text-xs text-center line-clamp-2 mb-3">{{ item.caption || 'Tanpa keterangan' }}</p>
                <button @click="deleteGallery(item.id)" class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors" title="Hapus Foto">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
