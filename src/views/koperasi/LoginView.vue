<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-8 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6" style="color: var(--color-rt-primary, #16a34a)">Login Bendahara (Koperasi RT)</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" v-model="email" required class="input input-bordered w-full mt-1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" v-model="password" required class="input input-bordered w-full mt-1" />
        </div>
        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
        <button type="submit" class="btn w-full text-white" style="background-color: var(--color-rt-primary, #16a34a); border-color: var(--color-rt-primary, #16a34a)" :disabled="loading">
          <span v-if="loading" class="loading loading-spinner"></span>
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    if (authStore.login) {
        await authStore.login(email.value, password.value)
    }
    router.push('/koperasi')
  } catch (err) {
    error.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
