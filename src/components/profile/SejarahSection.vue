<script setup>
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const sejarah = profileStore.getProfileValue('sejarah')
</script>

<template>
  <section class="py-24 bg-[var(--color-rt-light-alt)]">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <!-- Content -->
        <div class="lg:col-span-7">
          <div v-animate class="flex items-center gap-3 mb-6">
            <span class="w-12 h-1 bg-[var(--color-rt-primary)] rounded-full"></span>
            <span class="text-[var(--color-rt-primary)] font-bold tracking-wider uppercase text-sm">Jejak Langkah</span>
          </div>
          
          <h2 v-animate class="delay-100 text-3xl md:text-5xl font-bold text-[var(--color-rt-dark)] mb-8 leading-tight" style="font-family: var(--font-serif);">
            Sejarah RT 27
          </h2>
          
          <div v-animate class="delay-200 prose prose-lg prose-green max-w-none text-gray-700 leading-relaxed">
            <p v-if="sejarah?.content" class="whitespace-pre-line">{{ sejarah.content }}</p>
            <p v-else>
              RT 27 merupakan salah satu rukun tetangga yang berada di wilayah Kalimantan Timur. Didirikan sebagai bagian dari upaya penataan administrasi kependudukan, RT 27 telah berkembang menjadi komunitas yang solid dengan semangat gotong royong yang tinggi. Berbagai kegiatan sosial, keagamaan, dan pembangunan telah dilaksanakan oleh warga RT 27 untuk meningkatkan kualitas hidup bersama.
            </p>
          </div>
        </div>

        <!-- Image & Badge -->
        <div class="lg:col-span-5 relative">
          <div v-animate class="delay-300 relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5]">
            <img 
              src="https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800" 
              alt="Sejarah RT 27" 
              class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div class="absolute inset-0 bg-[var(--color-rt-primary)]/20 mix-blend-multiply"></div>
          </div>

          <!-- Established Badge -->
          <div v-animate class="delay-400 absolute -bottom-10 -left-10 md:-left-16 bg-white p-8 rounded-full shadow-2xl border-8 border-[var(--color-rt-light-alt)] w-40 h-40 flex flex-col items-center justify-center animate-pulse-soft hidden sm:flex">
            <span class="text-sm font-bold text-[var(--color-rt-secondary)] uppercase tracking-widest mb-1">Sejak</span>
            <span class="text-4xl font-bold text-[var(--color-rt-primary)]" style="font-family: var(--font-serif);">{{ sejarah?.established_year || '2010' }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
