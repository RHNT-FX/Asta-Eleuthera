<script setup>
import { ref, onMounted } from 'vue'
import { useKoperasiStore } from '@/stores/koperasi'
import { useToastStore } from '@/stores/toast'

const koperasiStore = useKoperasiStore()
const toast = useToastStore()

const pinjaman = ref([])
const wargaList = ref([])
const loading = ref(true)

// Modals
const isCreateModalOpen = ref(false)
const isAngsuranModalOpen = ref(false)
const saving = ref(false)

// Forms
const createForm = ref({
  warga_id: '',
  jumlah_pinjaman: 0,
  bunga_persen: 0,
  tenor_bulan: 1,
})

const angsuranForm = ref({
  pinjaman_id: null,
  jumlah_bayar: 0,
})

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  await Promise.all([
    koperasiStore.fetchWarga(),
    koperasiStore.fetchPinjaman()
  ])
  wargaList.value = koperasiStore.warga
  pinjaman.value = koperasiStore.pinjaman
  loading.value = false
}

function openCreateModal() {
  createForm.value = { warga_id: '', jumlah_pinjaman: 0, bunga_persen: 0, tenor_bulan: 1 }
  isCreateModalOpen.value = true
}

function closeCreateModal() {
  isCreateModalOpen.value = false
}

async function handleCreatePinjaman() {
  if (!createForm.value.warga_id || createForm.value.jumlah_pinjaman <= 0 || createForm.value.tenor_bulan <= 0) {
    toast.showToast('Mohon isi data dengan benar', 'error')
    return
  }
  
  saving.value = true
  const totalKembalikan = Number(createForm.value.jumlah_pinjaman) + (Number(createForm.value.jumlah_pinjaman) * Number(createForm.value.bunga_persen) / 100)
  
  const payload = {
    warga_id: createForm.value.warga_id,
    jumlah_pinjaman: createForm.value.jumlah_pinjaman,
    bunga_persen: createForm.value.bunga_persen,
    tenor_bulan: createForm.value.tenor_bulan,
    sisa_tagihan: totalKembalikan,
    status: 'aktif'
  }

  const result = await koperasiStore.addPinjaman(payload)
  if (result.success) {
    toast.showToast('Pinjaman berhasil ditambahkan', 'success')
    closeCreateModal()
    await loadData()
  } else {
    toast.showToast('Gagal menambahkan pinjaman', 'error')
  }
  saving.value = false
}

function openAngsuranModal(p) {
  angsuranForm.value = { pinjaman_id: p.id, jumlah_bayar: 0 }
  isAngsuranModalOpen.value = true
}

function closeAngsuranModal() {
  isAngsuranModalOpen.value = false
}

async function handleAngsuran() {
  if (angsuranForm.value.jumlah_bayar <= 0) {
    toast.showToast('Jumlah bayar tidak valid', 'error')
    return
  }
  
  saving.value = true
  const p = pinjaman.value.find(x => x.id === angsuranForm.value.pinjaman_id)
  
  const payload = {
    pinjaman_id: p.id,
    jumlah_bayar: angsuranForm.value.jumlah_bayar
  }

  const result = await koperasiStore.addAngsuran(payload)
  if (result.success) {
    toast.showToast('Angsuran berhasil dicatat', 'success')
    closeAngsuranModal()
    await loadData()
  } else {
    toast.showToast('Gagal mencatat angsuran', 'error')
  }
  saving.value = false
}

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount || 0)
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(dateStr))
}

function getWargaName(wargaId) {
  const w = wargaList.value.find(x => x.id === wargaId)
  return w ? w.nama : 'Unknown'
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-[var(--color-rt-dark)]">Kelola Pinjaman</h1>
      <button @click="openCreateModal" class="bg-[var(--color-rt-primary)] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[var(--color-rt-primary-light)]">
        + Buat Pinjaman
      </button>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">Memuat data pinjaman...</div>
      
      <div v-else-if="pinjaman.length === 0" class="p-8 text-center text-gray-500">
        Belum ada data pinjaman.
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-gray-600">
            <tr>
              <th class="px-6 py-4 font-semibold">Nama Warga</th>
              <th class="px-6 py-4 font-semibold">Tgl Pinjam</th>
              <th class="px-6 py-4 font-semibold">Pinjaman (Tenor)</th>
              <th class="px-6 py-4 font-semibold">Sisa Tagihan</th>
              <th class="px-6 py-4 font-semibold">Status</th>
              <th class="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="p in pinjaman" :key="p.id" class="hover:bg-gray-50/50">
              <td class="px-6 py-4 font-medium text-gray-900">{{ getWargaName(p.warga_id) }}</td>
              <td class="px-6 py-4 text-gray-600">{{ formatDate(p.tanggal_pinjam) }}</td>
              <td class="px-6 py-4">
                <div class="text-gray-900 font-medium">{{ formatRupiah(p.jumlah_pinjaman) }}</div>
                <div class="text-xs text-gray-500">{{ p.tenor_bulan }} bulan (Bunga: {{ p.bunga_persen }}%)</div>
              </td>
              <td class="px-6 py-4">
                <span class="text-red-600 font-medium">{{ formatRupiah(p.sisa_tagihan) }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="p.status === 'lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'" class="px-2.5 py-1 rounded-full text-xs font-semibold uppercase">
                  {{ p.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button v-if="p.status === 'aktif'" @click="openAngsuranModal(p)" class="text-[var(--color-rt-primary)] hover:text-[var(--color-rt-primary-light)] text-sm font-medium">
                  Bayar Angsuran
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Create Pinjaman -->
    <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl w-full max-w-md p-6">
        <h3 class="text-xl font-bold text-[var(--color-rt-dark)] mb-4">Buat Pinjaman Baru</h3>
        <form @submit.prevent="handleCreatePinjaman" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Warga</label>
            <select v-model="createForm.warga_id" required class="w-full rounded-xl border-gray-200 px-4 py-2 border">
              <option value="" disabled>-- Pilih Warga --</option>
              <option v-for="w in wargaList" :key="w.id" :value="w.id">{{ w.nama }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Pinjaman (Rp)</label>
            <input v-model.number="createForm.jumlah_pinjaman" type="number" required min="1" class="w-full rounded-xl border-gray-200 px-4 py-2 border" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bunga (%)</label>
              <input v-model.number="createForm.bunga_persen" type="number" min="0" step="any" class="w-full rounded-xl border-gray-200 px-4 py-2 border" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tenor (Bulan)</label>
              <input v-model.number="createForm.tenor_bulan" type="number" required min="1" class="w-full rounded-xl border-gray-200 px-4 py-2 border" />
            </div>
          </div>
          
          <div class="pt-4 flex gap-3">
            <button type="button" @click="closeCreateModal" class="flex-1 px-4 py-2 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50">Batal</button>
            <button type="submit" :disabled="saving" class="flex-1 px-4 py-2 rounded-xl bg-[var(--color-rt-primary)] text-white font-medium hover:bg-[var(--color-rt-primary-light)] disabled:opacity-50">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Angsuran -->
    <div v-if="isAngsuranModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl w-full max-w-md p-6">
        <h3 class="text-xl font-bold text-[var(--color-rt-dark)] mb-4">Bayar Angsuran</h3>
        <form @submit.prevent="handleAngsuran" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Bayar (Rp)</label>
            <input v-model.number="angsuranForm.jumlah_bayar" type="number" required min="1" class="w-full rounded-xl border-gray-200 px-4 py-2 border" />
          </div>
          <div class="pt-4 flex gap-3">
            <button type="button" @click="closeAngsuranModal" class="flex-1 px-4 py-2 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50">Batal</button>
            <button type="submit" :disabled="saving" class="flex-1 px-4 py-2 rounded-xl bg-[var(--color-rt-primary)] text-white font-medium hover:bg-[var(--color-rt-primary-light)] disabled:opacity-50">
              {{ saving ? 'Memproses...' : 'Bayar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
