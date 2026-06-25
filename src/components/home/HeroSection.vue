<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img
        src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1920"
        alt="Desa RT 27"
        class="w-full h-full object-cover object-center"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-[var(--color-rt-dark)]/80 via-[var(--color-rt-primary)]/70 to-[var(--color-rt-dark)]/90"></div>
    </div>

    <!-- Decorative blur circles -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-rt-accent)]/20 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-rt-primary)]/30 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="relative z-10 container mx-auto px-6 pt-20 pb-12 flex flex-col items-center text-center">
      <!-- Badge -->
      <div v-animate class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-rt-accent)] opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-rt-accent)]"></span>
        </span>
        <span class="text-xs font-semibold tracking-wider text-white uppercase" style="font-family: var(--font-sans);">Portal Resmi</span>
      </div>

      <!-- Heading -->
      <h1 v-animate class="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl" style="font-family: var(--font-serif);">
        Selamat Datang di <br /> <span class="text-[var(--color-rt-accent)]">RT 27</span>
      </h1>

      <!-- Subtext -->
      <p v-animate class="delay-100 text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed" style="font-family: var(--font-sans);">
        Portal informasi resmi untuk seluruh warga RT 27. Temukan berita terbaru, informasi kegiatan, dan layanan komunitas kami.
      </p>

      <!-- CTAs -->
      <div v-animate class="delay-200 flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto">
        <RouterLink
          to="/profil"
          class="px-8 py-3.5 rounded-xl font-semibold text-white border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
        >
          Lihat Profil
        </RouterLink>
        <RouterLink
          to="/artikel"
          class="px-8 py-3.5 rounded-xl font-semibold text-[var(--color-rt-dark)] bg-white hover:bg-[var(--color-rt-light)] transition-all duration-300 w-full sm:w-auto shadow-lg shadow-white/10 hover:shadow-white/20 hover:-translate-y-1"
        >
          Baca Artikel
        </RouterLink>
      </div>

      <!-- Stats -->
      <div v-animate class="delay-300 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 pt-10 border-t border-white/10 w-full max-w-4xl">
        <div class="flex flex-col items-center">
          <span class="text-3xl font-bold text-white mb-1" style="font-family: var(--font-serif);">150+</span>
          <span class="text-sm text-white/60 font-medium tracking-wide uppercase">Kepala Keluarga</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-3xl font-bold text-[var(--color-rt-accent)] mb-1" style="font-family: var(--font-serif);">Aktif</span>
          <span class="text-sm text-white/60 font-medium tracking-wide uppercase">Gotong Royong</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-3xl font-bold text-white mb-1" style="font-family: var(--font-serif);">24/7</span>
          <span class="text-sm text-white/60 font-medium tracking-wide uppercase">Informasi Terkini</span>
        </div>
      </div>
    </div>
  </section>
</template>
