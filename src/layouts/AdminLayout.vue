<script setup>
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const menuItems = [
  { name: 'Dashboard', icon: 'grid', route: 'admin-dashboard' },
  { name: 'Artikel', icon: 'file-text', route: 'admin-artikel' },
  { name: 'Modul', icon: 'download', route: 'admin-modul' },
  { name: 'Profil RT', icon: 'users', route: 'admin-profil' },
]

const currentRouteName = computed(() => route.name)

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <div class="min-h-screen flex bg-[var(--color-rt-light-alt)]">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-rt-dark)] text-white transform transition-transform duration-300 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center gap-3 px-6 border-b border-white/10">
        <img src="/images/AE1.png" alt="Logo" class="w-8 h-8 rounded-lg" />
        <div>
          <h1 class="text-sm font-bold tracking-wide">RT 27 Admin</h1>
          <p class="text-[10px] text-white/50">Panel Pengelola</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-3 space-y-1">
        <RouterLink
          v-for="item in menuItems"
          :key="item.route"
          :to="{ name: item.route }"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          :class="
            currentRouteName === item.route
              ? 'bg-[var(--color-rt-primary)] text-white shadow-lg shadow-[var(--color-rt-primary)]/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          "
          @click="sidebarOpen = false"
        >
          <!-- Icons -->
          <svg v-if="item.icon === 'grid'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <svg v-else-if="item.icon === 'file-text'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else-if="item.icon === 'download'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else-if="item.icon === 'users'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ item.name }}</span>
        </RouterLink>
      </nav>

      <!-- Bottom Actions -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <RouterLink
          :to="{ name: 'home' }"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all mb-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Lihat Website</span>
        </RouterLink>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Keluar</span>
        </button>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64">
      <!-- Top Bar -->
      <header class="h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 flex items-center justify-between px-6 sticky top-0 z-30">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-[var(--color-rt-primary)] flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <span class="text-sm font-medium text-[var(--color-rt-dark)]">Admin</span>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>