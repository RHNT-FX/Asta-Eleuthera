import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const isVisible = ref(false)
  const message = ref('')
  const type = ref('success') // 'success' | 'error'

  let timeout = null

  function showToast(msg, toastType = 'success') {
    message.value = msg
    type.value = toastType
    isVisible.value = true

    // Reset timer jika ada toast baru yang muncul cepat
    if (timeout) clearTimeout(timeout)

    // Hilang otomatis setelah 3 detik
    timeout = setTimeout(() => {
      isVisible.value = false
    }, 3000)
  }

  return { isVisible, message, type, showToast }
})