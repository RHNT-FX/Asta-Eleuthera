<script setup>
import { ref, onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const activeTab = ref('visiMisi')
const saving = ref(false)

// Forms Data (cloned from store on mount to allow editing without immediate save)
const visiMisi = ref({ visi: '', misi: [] })
const sejarah = ref({ content: '', established_year: '' })
const pengurus = ref([])
const kontak = ref({ whatsapp: '', email: '', phone: '', address: '', lat: -1.2654, lng: 116.8312 })
const gallery = ref([])

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
  gallery.value = JSON.parse(JSON.stringify(profileStore.gallery || []))
})

// Misi Actions
function addMisi() { visiMisi.value.misi.push('') }
function removeMisi(index) { visiMisi.value.misi.splice(index, 1) }

// Pengurus Actions
function addPengurus() { pengurus.value.push({ nama: '', jabatan: '', foto: '' }) }
function removePengurus(index) { pengurus.value.splice(index, 1) }

// Save Handlers
async function saveVisiMisi() {
  saving.value = true
  await new Promise(r => setTimeout(r, 500))
  // Save to store/supabase logic here
  console.log('Saved Visi Misi', visiMisi.value)
  saving.value = false
  alert('Visi Misi berhasil disimpan!')
}

async function saveSejarah() {
  saving.value = true
  await new Promise(r => setTimeout(r, 500))
  console.log('Saved Sejarah', sejarah.value)
  saving.value = false
  alert('Sejarah berhasil disimpan!')
}

async function savePengurus() {
  saving.value = true
  await new Promise(r => setTimeout(r, 500))
  console.log('Saved Pengurus', pengurus.value)
  saving.value = false
  alert('Pengurus berhasil disimpan!')
}

async function saveKontak() {
  saving.value = true
  await new Promise(r => setTimeout(r, 500))
  console.log('Saved Kontak', kontak.value)
  saving.value = false
  alert('Kontak berhasil disimpan!')
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
      <div v-if="activeTab === 'galeri'" class="space-y-6 text-center py-10">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <h3 class="text-xl font-bold text-[var(--color-rt-dark)]">Manajemen Galeri</h3>
        <p class="text-gray-500">Fitur upload dan hapus foto galeri akan segera hadir pada update berikutnya.</p>
      </div>

    </div>
  </div>
</template>
