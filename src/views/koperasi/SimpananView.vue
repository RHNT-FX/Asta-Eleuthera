<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--color-rt-primary, #16a34a)">Data Simpanan</h1>
      <button @click="openModal" class="btn text-white" style="background-color: var(--color-rt-primary, #16a34a); border: none;">Tambah Transaksi</button>
    </div>

    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr class="bg-gray-50">
            <th>Tanggal</th>
            <th>Nama Warga</th>
            <th>Jenis</th>
            <th>Nominal</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="koperasiStore.loading && koperasiStore.transaksi.length === 0">
            <td colspan="5" class="text-center py-4">Loading...</td>
          </tr>
          <tr v-else-if="koperasiStore.transaksi.length === 0">
            <td colspan="5" class="text-center py-4">Belum ada transaksi.</td>
          </tr>
          <tr v-for="t in koperasiStore.transaksi" :key="t.id" class="hover">
            <td>{{ formatDate(t.tanggal) }}</td>
            <td class="font-semibold">{{ t.koperasi_warga?.nama }}</td>
            <td>
              <span class="badge" :class="{
                'badge-success': t.jenis === 'Wajib' || t.jenis === 'Sukarela',
                'badge-error': t.jenis === 'Tarik'
              }">{{ t.jenis }}</span>
            </td>
            <td :class="t.jenis === 'Tarik' ? 'text-red-500' : 'text-green-600'">
              {{ t.jenis === 'Tarik' ? '-' : '+' }}{{ formatRupiah(t.jumlah) }}
            </td>
            <td>{{ t.keterangan || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Transaksi -->
    <dialog class="modal" :class="{'modal-open': showModal}">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Tambah Transaksi Simpanan</h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Warga</label>
            <select v-model="form.warga_id" required class="select select-bordered w-full mt-1">
              <option disabled value="">Pilih Warga</option>
              <option v-for="w in koperasiStore.warga" :key="w.id" :value="w.id">{{ w.nama }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Jenis Transaksi</label>
            <select v-model="form.jenis" @change="handleJenisChange" required class="select select-bordered w-full mt-1">
              <option value="Pokok">Simpanan Pokok</option>
              <option value="Wajib">Simpanan Wajib</option>
              <option value="Sukarela">Simpanan Sukarela</option>
              <option value="Tarik">Tarik Simpanan</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nominal (Rp)</label>
            <input type="text" :value="formatInput(form.jumlah)" @input="handleJumlahInput" required class="input input-bordered w-full mt-1" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Keterangan</label>
            <input type="text" v-model="form.keterangan" class="input input-bordered w-full mt-1" />
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
  warga_id: '',
  jenis: 'Wajib',
  jumlah: 20000,
  keterangan: ''
})

onMounted(() => {
  if (koperasiStore.warga.length === 0) koperasiStore.fetchWarga()
  koperasiStore.fetchTransaksi()
})

const openModal = () => {
  form.value = { warga_id: '', jenis: 'Wajib', jumlah: 20000, keterangan: '' }
  showModal.value = true
}

const handleJenisChange = () => {
  if (form.value.jenis === 'Pokok') {
    form.value.jumlah = 50000
  } else if (form.value.jenis === 'Wajib') {
    form.value.jumlah = 20000
  } else {
    form.value.jumlah = ''
  }
}

const formatInput = (num) => {
  if (!num) return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const handleJumlahInput = (e) => {
  let val = e.target.value.replace(/[^0-9]/g, '')
  form.value.jumlah = val ? parseInt(val, 10) : ''
}

const submitForm = async () => {
  try {
    await koperasiStore.addTransaksi({ ...form.value })
    showModal.value = false
  } catch (error) {
    alert('Gagal menambahkan transaksi: ' + error.message)
  }
}

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
