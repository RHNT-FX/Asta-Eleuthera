<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Silakan masukkan email dan password.'
    return
  }

  error.value = ''
  
  const result = await authStore.login(email.value, password.value)
  
  if (result.success) {
    const redirectPath = route.query.redirect || '/admin'
    router.push(redirectPath)
  } else {
    error.value = result.error || 'Login gagal. Periksa kembali kredensial Anda.'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[var(--color-rt-primary)] via-[var(--color-rt-secondary)] to-[var(--color-rt-dark)] flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Decor -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-rt-accent)] rounded-full blur-[100px] opacity-20"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--color-rt-light)] rounded-full blur-[100px] opacity-10"></div>
    </div>

    <!-- Login Card -->
    <div class="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 md:p-10 shadow-2xl relative z-10">
      <div class="text-center mb-10">
        <div class="inline-block bg-white p-2 rounded-2xl mb-4 shadow-lg">
          <img src="/images/AE1.png" alt="Logo RT 27" class="w-12 h-12 rounded-xl" />
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-2" style="font-family: var(--font-sans);">
          Admin RT 27
        </h1>
        <p class="text-white/60 text-sm">Masuk untuk mengelola portal warga</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Error Message -->
        <div v-if="error" class="bg-red-500/10 border border-red-500/30 text-red-100 p-4 rounded-xl text-sm flex items-start gap-3 backdrop-blur-md">
          <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{{ error }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-white/80 mb-2">Email</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input 
              v-model="email"
              type="email" 
              required
              placeholder="admin@rt27.com"
              class="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-rt-accent)] focus:ring-1 focus:ring-[var(--color-rt-accent)] transition-all"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-white/80 mb-2">Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input 
              v-model="password"
              type="password" 
              required
              placeholder="••••••••"
              class="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-rt-accent)] focus:ring-1 focus:ring-[var(--color-rt-accent)] transition-all"
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="authStore.loading"
          class="w-full py-3.5 rounded-xl text-sm font-bold text-[var(--color-rt-primary)] bg-[var(--color-rt-accent)] hover:bg-white transition-all duration-300 shadow-lg shadow-[var(--color-rt-accent)]/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          <span v-if="!authStore.loading">Masuk</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5 text-[var(--color-rt-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          </span>
        </button>
      </form>

      <div class="mt-8 text-center">
        <RouterLink to="/" class="text-sm text-white/50 hover:text-white transition-colors flex items-center justify-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </RouterLink>
      </div>
    </div>
  </div>
</template>
