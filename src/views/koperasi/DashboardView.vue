<template>
  <div>
    <h1 class="text-2xl font-bold mb-6" style="color: var(--color-rt-primary, #16a34a)">Dashboard Koperasi</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 bg-white rounded shadow-sm border-l-4" style="border-color: var(--color-rt-primary, #16a34a)">
        <h3 class="text-gray-500 text-sm font-semibold uppercase">Total Kas (Simpanan)</h3>
        <p class="text-3xl font-bold mt-2">{{ formatRupiah(totalKas) }}</p>
      </div>
      <div class="p-6 bg-white rounded shadow-sm border-l-4 border-yellow-500">
        <h3 class="text-gray-500 text-sm font-semibold uppercase">Total Pinjaman Aktif</h3>
        <p class="text-3xl font-bold mt-2">{{ formatRupiah(totalPinjamanAktif) }}</p>
      </div>
      <div class="p-6 bg-white rounded shadow-sm border-l-4 border-blue-500">
        <h3 class="text-gray-500 text-sm font-semibold uppercase">Total Warga Terdaftar</h3>
        <p class="text-3xl font-bold mt-2">{{ koperasiStore.warga.length }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useKoperasiStore } from '@/stores/koperasi'

const koperasiStore = useKoperasiStore()

onMounted(async () => {
  await koperasiStore.fetchWarga()
  await koperasiStore.fetchPinjaman()
})

const totalKas = computed(() => {
  return koperasiStore.warga.reduce((sum, w) => sum + (Number(w.total_simpanan) || 0), 0)
})

const totalPinjamanAktif = computed(() => {
  return koperasiStore.pinjaman
    .filter(p => p.status !== 'Lunas')
    .reduce((sum, p) => sum + (Number(p.total_pinjaman) - (Number(p.terbayar) || 0)), 0)
})

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number || 0)
}
</script>
