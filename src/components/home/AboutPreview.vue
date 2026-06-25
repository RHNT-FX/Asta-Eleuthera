<script setup>
import { RouterLink } from 'vue-router'

const values = [
  {
    title: 'Gotong Royong',
    desc: 'Menjaga kerukunan dan kerjasama antar warga',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    title: 'Lingkungan Bersih',
    desc: 'Menciptakan lingkungan yang asri dan sehat',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
  },
  {
    title: 'Warga Sejahtera',
    desc: 'Mendorong pemberdayaan dan ekonomi mandiri',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  }
]
</script>

<template>
  <section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <!-- Left Image -->
        <div v-animate class="relative">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-auto lg:h-[600px]">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"
              alt="Warga RT 27"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-[var(--color-rt-primary)]/10"></div>
          </div>
          
          <!-- Floating Badge -->
          <div class="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[200px] animate-pulse-soft hidden sm:block">
            <div class="text-[var(--color-rt-primary)] mb-2">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <p class="font-bold text-[var(--color-rt-dark)] text-lg leading-tight">Berdiri Sejak<br/>2010</p>
          </div>
        </div>

        <!-- Right Content -->
        <div class="flex flex-col justify-center">
          <div v-animate class="flex items-center gap-3 mb-4">
            <span class="w-12 h-1 bg-[var(--color-rt-accent)] rounded-full"></span>
            <span class="text-[var(--color-rt-primary)] font-bold tracking-wider uppercase text-sm">Tentang RT 27</span>
          </div>
          
          <h2 v-animate class="delay-100 text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-rt-dark)] mb-6 leading-tight">
            Membangun Lingkungan yang Lebih Baik Bersama
          </h2>
          
          <p v-animate class="delay-200 text-gray-600 mb-10 leading-relaxed text-lg">
            RT 27 merupakan komunitas warga yang aktif dan peduli terhadap lingkungan. Kami berkomitmen untuk terus meningkatkan kualitas hidup warga melalui berbagai program dan kegiatan gotong royong.
          </p>

          <div class="space-y-6 mb-10">
            <div v-for="(item, index) in values" :key="index" v-animate :class="`delay-${300 + (index * 100)}`" class="flex gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-rt-light-alt)] flex items-center justify-center text-[var(--color-rt-primary)]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
                </svg>
              </div>
              <div>
                <h4 class="text-xl font-bold text-[var(--color-rt-dark)] mb-1" style="font-family: var(--font-serif);">{{ item.title }}</h4>
                <p class="text-gray-600">{{ item.desc }}</p>
              </div>
            </div>
          </div>

          <div v-animate class="delay-500 pt-4">
            <RouterLink
              to="/profil"
              class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-[var(--color-rt-primary)] hover:bg-[var(--color-rt-primary-light)] transition-all duration-300 shadow-lg shadow-[var(--color-rt-primary)]/20 hover:-translate-y-1"
            >
              Selengkapnya tentang kami
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
