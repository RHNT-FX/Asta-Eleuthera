<script setup>
import { RouterView } from 'vue-router'
import NavbarSection from '@/components/common/NavbarSection.vue'
import FooterSection from '@/components/common/FooterSection.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--color-rt-light)]">
    <NavbarSection />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <FooterSection />
  </div>
</template>
