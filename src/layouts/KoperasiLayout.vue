<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const currentRouteName = computed(() => route.name)

const logout = async () => {
  if (authStore.logout) {
      await authStore.logout()
  }
  router.push('/koperasi/login')
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 text-white transform transition-transform duration-300 md:translate-x-0"
      style="background-color: var(--color-rt-primary, #16a34a)"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-4 font-bold text-xl border-b border-white/20 h-16 flex items-center">
        Koperasi RT 27
      </div>
      <nav class="p-4 space-y-2 mt-2">
        <RouterLink 
          to="/koperasi" 
          class="block py-2 px-3 rounded transition-colors" 
          :class="currentRouteName === 'koperasi-dashboard' ? 'bg-white/20' : 'hover:bg-white/10'"
          @click="sidebarOpen = false"
        >
          Dashboard
        </RouterLink>
        <RouterLink 
          to="/koperasi/warga" 
          class="block py-2 px-3 rounded transition-colors" 
          :class="currentRouteName === 'koperasi-warga' ? 'bg-white/20' : 'hover:bg-white/10'"
          @click="sidebarOpen = false"
        >
          Data Warga
        </RouterLink>
        <RouterLink 
          to="/koperasi/simpanan" 
          class="block py-2 px-3 rounded transition-colors" 
          :class="currentRouteName === 'koperasi-simpanan' ? 'bg-white/20' : 'hover:bg-white/10'"
          @click="sidebarOpen = false"
        >
          Simpanan
        </RouterLink>
        <RouterLink 
          to="/koperasi/pinjaman" 
          class="block py-2 px-3 rounded transition-colors" 
          :class="currentRouteName === 'koperasi-pinjaman' ? 'bg-white/20' : 'hover:bg-white/10'"
          @click="sidebarOpen = false"
        >
          Pinjaman
        </RouterLink>
      </nav>
      <div class="absolute bottom-0 w-full p-4 border-t border-white/20">
        <button @click="logout" class="w-full text-left py-2 px-3 rounded hover:bg-red-500/80 transition">
          Logout
        </button>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main Content -->
    <div class="flex-1 md:ml-64 flex flex-col min-h-screen">
      <!-- Topbar for Mobile -->
      <header class="h-16 bg-white shadow-sm flex items-center px-4 md:hidden sticky top-0 z-30">
        <button @click="sidebarOpen = true" class="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="ml-4 font-bold text-gray-800 text-lg">Koperasi RT</div>
      </header>
      
      <main class="flex-1 p-6 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>
