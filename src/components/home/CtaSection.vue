<script setup>
import { RouterLink } from 'vue-router'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const kontak = profileStore.getProfileValue('kontak')
</script>

<template>
  <section class="relative bg-[var(--color-rt-primary)] overflow-hidden">
    <!-- Top SVG Wave -->
    <div class="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-10 text-[var(--color-rt-light-alt)]">
      <svg class="relative block w-full h-[40px] md:h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
      </svg>
    </div>

    <!-- Background Decoration -->
    <div class="absolute inset-0 z-0 opacity-10">
      <div class="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMS41IiBmaWxsPSIjZmZmZmZmIj48L2NpcmNsZT4KPC9zdmc+')]"></div>
    </div>
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-rt-accent)] rounded-full blur-[100px] opacity-20"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--color-rt-light)] rounded-full blur-[100px] opacity-10"></div>

    <div class="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
      <h2 v-animate class="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight" style="font-family: var(--font-serif);">
        Ada Pertanyaan atau Saran?
      </h2>
      <p v-animate class="delay-100 text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
        Hubungi pengurus RT 27 untuk informasi lebih lanjut mengenai layanan administrasi, laporan warga, atau kegiatan lingkungan.
      </p>

      <div v-animate class="delay-200 flex flex-col sm:flex-row gap-4 justify-center">
        <a
          :href="`https://wa.me/${kontak?.whatsapp || '6281234567890'}`"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-[var(--color-rt-primary)] bg-[var(--color-rt-accent)] hover:bg-white transition-all duration-300 shadow-lg shadow-[var(--color-rt-accent)]/20 hover:-translate-y-1"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Hubungi via WhatsApp
        </a>
        <RouterLink
          to="/profil"
          class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300"
        >
          Lihat Kontak
        </RouterLink>
      </div>
    </div>
  </section>
</template>
