<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--color-rt-primary, #16a34a)">Data Warga</h1>
      <button @click="showModal = true" class="btn text-white" style="background-color: var(--color-rt-primary, #16a34a); border: none;">Tambah Warga</button>
    </div>

    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr class="bg-gray-50">
            <th>No</th>
            <th>Nama</th>
            <th>NIK / KTP</th>
            <th>Alamat / Blok</th>
            <th>Total Simpanan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="koperasiStore.loading && koperasiStore.warga.length === 0">
            <td colspan="5" class="text-center py-4">Loading...</td>
          </tr>
          <tr v-else-if="koperasiStore.warga.length === 0">
            <td colspan="5" class="text-center py-4">Belum ada data warga.</td>
          </tr>
          <tr v-for="(w, index) in koperasiStore.warga" :key="w.id" class="hover">
            <td>{{ index + 1 }}</td>
            <td class="font-semibold">{{ w.nama }}</td>
            <td>{{ w.nik || '-' }}</td>
            <td>{{ w.blok_rumah || '-' }}</td>
            <td class="text-sm">
              <div class="text-green-600 font-bold">{{ formatRupiah(w.total_simpanan) }}</div>
              <div class="text-xs text-gray-500 mt-1">
                Pokok: {{ formatRupiah(w.simpanan_pokok) }} <br/>
                Wajib: {{ formatRupiah(w.simpanan_wajib) }} <br/>
                Sukarela: {{ formatRupiah(w.simpanan_sukarela) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Tambah Warga -->
    <dialog class="modal" :class="{'modal-open': showModal}">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Tambah Data Warga</h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" v-model="form.nama" required class="input input-bordered w-full mt-1" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">NIK (Opsional)</label>
            <input type="text" v-model="form.nik" class="input input-bordered w-full mt-1" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Alamat / Blok</label>
            <input type="text" v-model="form.blok_rumah" class="input input-bordered w-full mt-1" />
          </div>
          <div class="modal-action">
            <button type="button" class="btn" @click="showModal = false">Batal</button>
            <button type="submit" class="btn text-white" style="background-color: var(--color-rt-primary, #16a34a); border: none;" :disabled="koperasiStore.loading">
               Simpan
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useKoperasiStore } from '@/stores/koperasi'

const koperasiStore = useKoperasiStore()
const showModal = ref(false)

const form = ref({
  nama: '',
  nik: '',
  blok_rumah: '',
  total_simpanan: 0
})

onMounted(() => {
  koperasiStore.fetchWarga()
})

const submitForm = async () => {
  try {
    await koperasiStore.addWarga({ ...form.value })
    showModal.value = false
    form.value = { nama: '', nik: '', blok_rumah: '', total_simpanan: 0 }
  } catch (error) {
    alert('Gagal menambahkan warga: ' + error.message)
  }
}

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number || 0)
}
</script>
