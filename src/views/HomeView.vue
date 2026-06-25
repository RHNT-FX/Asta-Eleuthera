<script setup>
import HeroSection from '@/components/home/HeroSection.vue'
import AboutPreview from '@/components/home/AboutPreview.vue'
import LatestArticles from '@/components/home/LatestArticles.vue'
import ModulePreview from '@/components/home/ModulePreview.vue'
import MapSection from '@/components/home/MapSection.vue'
import CtaSection from '@/components/home/CtaSection.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <HeroSection />
    <AboutPreview />
    <LatestArticles />
    <ModulePreview />
    <MapSection />
    <CtaSection />
  </div>
</template>