<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Silakan masukkan email dan password.'
    return
  }

  error.value = ''
  loading.value = true
  
  try {
    const result = await authStore.login(email.value, password.value)
    
    if (result.success) {
      const redirectPath = route.query.redirect || '/admin'
      await router.push(redirectPath)
    } else {
      error.value = result.error || 'Login gagal. Periksa kembali kredensial Anda.'
    }
  } catch (err) {
    error.value = 'Gagal memproses navigasi: ' + err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-rt-dark)] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
    <!-- Ambient Background Lighting & Effects -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-32 w-[520px] h-[520px] bg-[var(--color-rt-primary)]/40 rounded-full blur-[130px]"></div>
      <div class="absolute -bottom-40 -left-32 w-[520px] h-[520px] bg-[var(--color-rt-accent)]/20 rounded-full blur-[140px]"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--color-rt-secondary)]/15 rounded-full blur-[160px]"></div>
      <!-- Subtle dot grid texture -->
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] opacity-35"></div>
    </div>

    <!-- Login Card Container -->
    <div class="w-full max-w-md relative z-10 my-8">
      <div class="backdrop-blur-2xl bg-white/[0.07] border border-white/15 rounded-3xl p-7 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-300 hover:border-white/25">
        <!-- Top subtle accent highlight -->
        <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-rt-accent)]/60 to-transparent"></div>

        <!-- Header Section -->
        <div class="text-center mb-8">

          <!-- Logo RT 27 -->
          <div class="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
            <div class="absolute inset-0 rounded-2xl bg-[var(--color-rt-accent)]/25 blur-lg"></div>
            <div class="relative w-full h-full bg-white/95 rounded-2xl p-2.5 shadow-xl flex items-center justify-center border border-white/40 transform transition-transform duration-300 hover:scale-105">
              <img src="/images/AE1.png" alt="Logo RT 27" class="w-full h-full object-contain" />
            </div>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2" style="font-family: var(--font-jakarta); letter-spacing: -0.025em;">
            Masuk Pengurus
          </h1>
          <p class="text-sm text-white/70 max-w-xs mx-auto leading-relaxed">
            Kelola publikasi artikel warga, modul edukasi, dan informasi lingkungan RT 27
          </p>
        </div>

        <!-- Error Message Alert -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-2 opacity-0"
        >
          <div 
            v-if="error" 
            role="alert" 
            class="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-100 text-sm flex items-start gap-3 backdrop-blur-md shadow-lg"
          >
            <svg class="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div class="flex-1">
              <p class="font-medium text-rose-200">Gagal Masuk</p>
              <p class="text-xs text-rose-200/80 mt-0.5 leading-relaxed">{{ error }}</p>
            </div>
          </div>
        </Transition>

        <!-- Form Fields -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email Input -->
          <div>
            <label for="admin-email" class="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
              Alamat Email
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[var(--color-rt-accent)] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input 
                id="admin-email"
                v-model="email"
                type="email" 
                required
                autocomplete="username"
                placeholder="admin@rt27.com"
                class="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] hover:bg-white/[0.09] border border-white/15 focus:border-[var(--color-rt-accent)] focus:bg-white/[0.12] rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-rt-accent)]/30 transition-all duration-200"
              />
            </div>
          </div>

          <!-- Password Input with Show/Hide Toggle -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="admin-password" class="block text-xs font-semibold uppercase tracking-wider text-white/80">
                Kata Sandi
              </label>
            </div>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[var(--color-rt-accent)] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                id="admin-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'" 
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full pl-11 pr-12 py-3.5 bg-white/[0.06] hover:bg-white/[0.09] border border-white/15 focus:border-[var(--color-rt-accent)] focus:bg-white/[0.12] rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-rt-accent)]/30 transition-all duration-200"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors focus:outline-none"
              >
                <!-- Eye icon when hidden -->
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Eye-slash icon when shown -->
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full py-3.5 px-6 rounded-xl text-sm font-semibold tracking-wide text-[var(--color-rt-dark)] bg-gradient-to-r from-[var(--color-rt-accent)] to-[var(--color-rt-accent-light)] hover:from-white hover:to-white transition-all duration-200 shadow-lg shadow-[var(--color-rt-accent)]/20 hover:shadow-xl hover:shadow-[var(--color-rt-accent)]/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <template v-if="!loading">
              <span>Masuk ke Dashboard</span>
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </template>
            <template v-else>
              <svg class="animate-spin h-5 w-5 text-[var(--color-rt-dark)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Memverifikasi Akses...</span>
            </template>
          </button>
        </form>

        <!-- Footer Navigation -->
        <div class="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-4 text-xs">
          <RouterLink 
            to="/" 
            class="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-white/[0.05]"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Beranda Warga
          </RouterLink>

          <span class="text-white/20">|</span>

          <RouterLink 
            to="/koperasi/login" 
            class="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-white/[0.05]"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Koperasi RT
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

