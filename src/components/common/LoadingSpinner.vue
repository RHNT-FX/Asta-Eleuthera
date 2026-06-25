<script setup>
import { ref } from 'vue'

const props = defineProps({
  size: { type: String, default: 'md' },
  text: { type: String, default: 'Memuat...' },
})

const sizes = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-12">
    <div
      class="rounded-full border-2 border-[var(--color-rt-accent)] border-t-[var(--color-rt-primary)] animate-spin"
      :class="sizes[size]"
    />
    <p v-if="text" class="text-sm text-[var(--color-rt-secondary)]">{{ text }}</p>
  </div>
</template>
