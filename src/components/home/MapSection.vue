<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const mapContainer = ref(null)
let map = null

onMounted(async () => {
  await profileStore.fetchProfile()
  const alamat = profileStore.getProfileValue('alamat')
  const kontak = profileStore.getProfileValue('kontak')
  
  const lat = alamat?.lat || -1.2654
  const lng = alamat?.lng || 116.8312

  // Initialize map
  map = L.map(mapContainer.value, {
    zoomControl: false,
    scrollWheelZoom: false,
  }).setView([lat, lng], 15)

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // Add custom zoom control to bottom right
  L.control.zoom({ position: 'bottomright' }).addTo(map)

  // Custom marker icon (green)
  const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `<div class="w-8 h-8 bg-[var(--color-rt-primary)] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  })

  // Add marker
  const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
  marker.bindPopup(`<b>RT 27</b><br>${alamat?.address || 'Kalimantan Timur'}`)
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
  }
})
</script>

<template>
  <section class="py-24 bg-[var(--color-rt-light-alt)] relative">
    <div class="max-w-7xl mx-auto px-6">
      <div v-animate class="text-center mb-12">
        <h2 class="text-3xl font-bold text-[var(--color-rt-dark)]" style="font-family: var(--font-serif);">Lokasi Kami</h2>
        <p class="text-gray-600 mt-2">Kunjungi lingkungan RT 27</p>
      </div>

      <div v-animate class="delay-100 relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-black/5 bg-white p-2">
        <!-- Map Container -->
        <div ref="mapContainer" class="w-full h-[400px] md:h-[500px] rounded-2xl z-0"></div>
        
        <!-- Info Overlay -->
        <div class="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl z-[400] border border-gray-100">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-[var(--color-rt-primary)]/10 text-[var(--color-rt-primary)] flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="font-bold text-[var(--color-rt-dark)] text-lg">Alamat RT 27</h3>
          </div>
          <p class="text-gray-600 text-sm leading-relaxed mb-4">
            {{ profileStore.getProfileValue('alamat')?.address || 'RT 27, Kalimantan Timur' }}
          </p>
          <a
            :href="`https://www.google.com/maps/search/?api=1&query=${profileStore.getProfileValue('alamat')?.lat || -1.2654},${profileStore.getProfileValue('alamat')?.lng || 116.8312}`"
            target="_blank"
            rel="noopener"
            class="text-[var(--color-rt-primary)] font-semibold text-sm hover:underline flex items-center gap-1"
          >
            Buka di Google Maps
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* Leaflet fixes for Tailwind */
.leaflet-container {
  font-family: var(--font-sans);
  z-index: 10;
}
.leaflet-popup-content-wrapper {
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.leaflet-popup-content {
  margin: 16px;
  line-height: 1.5;
}
</style>
