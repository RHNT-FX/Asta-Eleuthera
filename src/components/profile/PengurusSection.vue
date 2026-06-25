<script setup>
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const pengurus = profileStore.getProfileValue('pengurus') || []

function getInitials(name) {
  if (!name) return 'RT'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}
</script>

<template>
  <section class="py-24 bg-white relative">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 v-animate class="text-3xl md:text-4xl font-bold text-[var(--color-rt-dark)] mb-4" style="font-family: var(--font-serif);">Struktur Pengurus</h2>
        <div v-animate class="w-24 h-1 bg-[var(--color-rt-primary)] mx-auto rounded-full"></div>
        <p v-animate class="delay-100 mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
          Mengenal lebih dekat para pengurus RT 27 yang senantiasa melayani dan mengayomi warga.
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        <div 
          v-for="(person, index) in pengurus" 
          :key="index"
          v-animate
          :class="`delay-${(index % 4) * 100}`"
          class="group bg-[var(--color-rt-light-alt)] rounded-[2rem] p-6 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-xl shadow-[var(--color-rt-primary)]/10"
        >
          <!-- Foto / Avatar -->
          <div class="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-6">
            <div class="absolute inset-0 bg-[var(--color-rt-accent)] rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 scale-110"></div>
            <img 
              v-if="person.foto" 
              :src="person.foto" 
              :alt="person.nama" 
              class="relative w-full h-full object-cover rounded-full border-4 border-white shadow-md z-10"
            />
            <div 
              v-else 
              class="relative w-full h-full rounded-full border-4 border-white shadow-md z-10 bg-gradient-to-br from-[var(--color-rt-primary)] to-[var(--color-rt-secondary)] flex items-center justify-center text-white text-2xl md:text-4xl font-bold"
              style="font-family: var(--font-serif);"
            >
              {{ getInitials(person.nama) }}
            </div>
          </div>

          <!-- Info -->
          <h3 class="text-lg md:text-xl font-bold text-[var(--color-rt-dark)] mb-1 leading-tight group-hover:text-[var(--color-rt-primary)] transition-colors">
            {{ person.nama }}
          </h3>
          <p class="text-[var(--color-rt-secondary)] text-sm font-medium uppercase tracking-wide">
            {{ person.jabatan }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
