<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import ToastNotification from '@/components/common/ToastNotification.vue'

onMounted(() => {
  document.documentElement.setAttribute('data-theme', 'light')
})
</script>

<template>
  <RouterView />
  <ToastNotification />
</template>