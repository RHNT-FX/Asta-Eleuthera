<script setup>
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const visiMisi = profileStore.getProfileValue('visi_misi')
</script>

<template>
  <section class="py-24 bg-white relative overflow-hidden">
    <!-- Decor -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-[var(--color-rt-accent)]/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-rt-primary)]/5 rounded-full blur-3xl"></div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div class="text-center mb-16">
        <h2 v-animate class="text-3xl md:text-4xl font-bold text-[var(--color-rt-dark)] mb-4" style="font-family: var(--font-serif);">Visi & Misi</h2>
        <div v-animate class="w-24 h-1 bg-[var(--color-rt-accent)] mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <!-- Visi -->
        <div v-animate class="delay-100 bg-[var(--color-rt-light-alt)] p-10 md:p-12 rounded-[2rem] relative shadow-xl shadow-black/5">
          <!-- Big Quote Mark -->
          <svg class="absolute top-6 left-6 w-20 h-20 text-[var(--color-rt-primary)]/10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          
          <div class="relative z-10">
            <h3 class="text-2xl font-bold text-[var(--color-rt-primary)] mb-6 tracking-wide uppercase text-sm">Visi</h3>
            <p class="text-2xl md:text-3xl font-medium text-[var(--color-rt-dark)] leading-tight" style="font-family: var(--font-serif);">
              "{{ visiMisi?.visi || 'Mewujudkan lingkungan RT 27 yang bersih, aman, nyaman, dan gotong royong untuk kesejahteraan bersama.' }}"
            </p>
          </div>
        </div>

        <!-- Misi -->
        <div v-animate class="delay-200">
          <h3 class="text-2xl font-bold text-[var(--color-rt-primary)] mb-8 tracking-wide uppercase text-sm">Misi</h3>
          <ul class="space-y-6">
            <li 
              v-for="(item, index) in (visiMisi?.misi || [])" 
              :key="index"
              class="flex items-start gap-4 group"
            >
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-rt-accent)]/20 text-[var(--color-rt-primary)] flex items-center justify-center font-bold group-hover:bg-[var(--color-rt-primary)] group-hover:text-white transition-colors duration-300">
                {{ index + 1 }}
              </div>
              <p class="text-lg text-gray-700 pt-1.5 group-hover:text-[var(--color-rt-dark)] transition-colors">
                {{ item }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
