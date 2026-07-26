<template>
  <div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside class="w-full md:w-64 text-white flex-shrink-0" style="background-color: var(--color-rt-primary, #16a34a)">
      <div class="p-4 font-bold text-xl border-b border-white/20">
        Koperasi RT 27
      </div>
      <nav class="p-4 space-y-2">
        <RouterLink to="/koperasi" class="block py-2 px-3 rounded hover:bg-white/10" active-class="bg-white/20" exact-active-class="bg-white/20">
          Dashboard
        </RouterLink>
        <RouterLink to="/koperasi/warga" class="block py-2 px-3 rounded hover:bg-white/10" active-class="bg-white/20">
          Data Warga
        </RouterLink>
        <RouterLink to="/koperasi/simpanan" class="block py-2 px-3 rounded hover:bg-white/10" active-class="bg-white/20">
          Simpanan
        </RouterLink>
        <RouterLink to="/koperasi/pinjaman" class="block py-2 px-3 rounded hover:bg-white/10" active-class="bg-white/20">
          Pinjaman
        </RouterLink>
      </nav>
      <div class="p-4 mt-auto border-t border-white/20">
        <button @click="logout" class="w-full text-left py-2 px-3 rounded hover:bg-red-500/80 transition">
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  if (authStore.logout) {
      await authStore.logout()
  }
  router.push('/koperasi/login')
}
</script>
