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
      <div class="p-6 bg-white rounded shadow-sm border-l-4 border-purple-500">
        <h3 class="text-gray-500 text-sm font-semibold uppercase">Total Laba / SHU</h3>
        <p class="text-3xl font-bold mt-2 text-purple-600">{{ formatRupiah(totalSHU) }}</p>
      </div>
      <div class="p-6 bg-white rounded shadow-sm border-l-4 border-blue-500">
        <h3 class="text-gray-500 text-sm font-semibold uppercase">Total Warga Terdaftar</h3>
        <p class="text-3xl font-bold mt-2">{{ koperasiStore.warga.length }}</p>
      </div>
    </div>

    <!-- Tabel Peringkat SHU -->
    <div class="mt-8 bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">Estimasi Pembagian SHU per Warga</h2>
        <span class="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">Berdasarkan Total Pinjaman</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-white text-gray-500">
            <tr>
              <th class="px-6 py-4 font-semibold">Peringkat</th>
              <th class="px-6 py-4 font-semibold">Nama Warga</th>
              <th class="px-6 py-4 font-semibold">Total Pinjaman</th>
              <th class="px-6 py-4 font-semibold">Kontribusi Bunga (10%)</th>
              <th class="px-6 py-4 font-semibold text-purple-600">Estimasi SHU Diterima</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="shuLeaderboard.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">Belum ada data pinjaman untuk dihitung SHU-nya.</td>
            </tr>
            <tr v-for="(item, index) in shuLeaderboard" :key="item.warga_id" class="hover:bg-gray-50/50">
              <td class="px-6 py-4 font-bold text-gray-400">#{{ index + 1 }}</td>
              <td class="px-6 py-4 font-semibold text-gray-800">{{ item.nama }}</td>
              <td class="px-6 py-4 text-gray-600">{{ formatRupiah(item.totalPinjam) }}</td>
              <td class="px-6 py-4 text-gray-600">{{ formatRupiah(item.kontribusiBunga) }}</td>
              <td class="px-6 py-4 font-bold text-purple-600">+ {{ formatRupiah(item.estimasiSHU) }}</td>
            </tr>
          </tbody>
        </table>
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
    .filter(p => p.status === 'aktif')
    .reduce((sum, p) => sum + (Number(p.sisa_tagihan) || 0), 0)
})

const totalSHU = computed(() => {
  return koperasiStore.pinjaman.reduce((sum, p) => sum + (Number(p.jumlah_pinjaman) * (Number(p.bunga_persen) || 0) / 100), 0)
})

const shuLeaderboard = computed(() => {
  const map = {}
  
  // Aggregate data per warga
  koperasiStore.pinjaman.forEach(p => {
    if (!map[p.warga_id]) {
      map[p.warga_id] = {
        warga_id: p.warga_id,
        nama: p.koperasi_warga?.nama || 'Unknown',
        totalPinjam: 0,
        kontribusiBunga: 0,
      }
    }
    const pinjam = Number(p.jumlah_pinjaman) || 0
    const bunga = pinjam * (Number(p.bunga_persen) || 0) / 100
    
    map[p.warga_id].totalPinjam += pinjam
    map[p.warga_id].kontribusiBunga += bunga
  })

  // Convert to array and calculate SHU (asumsi: 50% dari bunga dikembalikan ke peminjam sebagai SHU)
  const list = Object.values(map).map(item => {
    return {
      ...item,
      estimasiSHU: item.kontribusiBunga * 0.5 // 50% dikembalikan
    }
  })

  // Sort by highest SHU
  return list.sort((a, b) => b.estimasiSHU - a.estimasiSHU)
})

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number || 0)
}
</script>
