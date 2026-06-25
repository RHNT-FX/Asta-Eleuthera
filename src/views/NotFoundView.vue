<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-[var(--color-rt-light)] flex items-center justify-center pt-20 px-6">
    <div class="text-center max-w-lg mx-auto">
      <div class="relative inline-block mb-8">
        <h1 class="text-9xl font-bold text-[var(--color-rt-primary)]/10" style="font-family: var(--font-serif);">
          404
        </h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="w-16 h-16 text-[var(--color-rt-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      <h2 class="text-3xl font-bold text-[var(--color-rt-dark)] mb-4" style="font-family: var(--font-serif);">
        Halaman Tidak Ditemukan
      </h2>
      <p class="text-gray-600 text-lg mb-10 leading-relaxed">
        Maaf, halaman yang Anda cari mungkin telah dihapus, namanya diubah, atau sementara tidak tersedia.
      </p>

      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-[var(--color-rt-primary)] hover:bg-[var(--color-rt-primary-light)] transition-all duration-300 shadow-lg shadow-[var(--color-rt-primary)]/20 hover:-translate-y-1"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Kembali ke Beranda
      </RouterLink>
    </div>
  </div>
</template>
