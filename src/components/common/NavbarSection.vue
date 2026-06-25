<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)
const mobileOpen = ref(false)

const navLinks = [
  { name: 'Beranda', to: '/' },
  { name: 'Profil', to: '/profil' },
  { name: 'Artikel', to: '/artikel' },
  { name: 'Modul', to: '/modul' },
]

function handleScroll() {
  scrolled.value = window.scrollY > 50
}

function closeMobile() {
  mobileOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    class="fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500"
    :class="scrolled ? 'w-[90%] max-w-5xl' : 'w-[95%] max-w-6xl'"
  >
    <div
      class="rounded-2xl border transition-all duration-500 px-4 sm:px-6 py-3"
      :class="
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-gray-200/60 shadow-lg shadow-black/5'
          : 'bg-white/70 backdrop-blur-md border-white/30 shadow-md shadow-black/3'
      "
    >
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 group" @click="closeMobile">
          <img
            src="/images/AE1.png"
            alt="Logo RT 27"
            class="w-9 h-9 rounded-xl transition-transform duration-300 group-hover:scale-110"
          />
          <div class="leading-tight">
            <span class="text-base font-bold text-[var(--color-rt-dark)] tracking-tight">RT 27</span>
            <span class="block text-[10px] text-[var(--color-rt-secondary)] font-medium -mt-0.5">Portal Warga</span>
          </div>
        </RouterLink>

        <!-- Desktop Nav Links -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="
              route.path === link.to || (link.to !== '/' && route.path.startsWith(link.to))
                ? 'text-[var(--color-rt-primary)] bg-[var(--color-rt-accent)]/20'
                : 'text-[var(--color-rt-secondary)] hover:text-[var(--color-rt-primary)] hover:bg-[var(--color-rt-light-alt)]'
            "
          >
            {{ link.name }}
          </RouterLink>
        </div>

        <!-- Desktop CTA -->
        <div class="hidden md:flex items-center gap-3">
          <RouterLink
            to="/admin/login"
            class="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[var(--color-rt-primary)] hover:bg-[var(--color-rt-primary-light)] transition-all duration-200 hover:shadow-lg hover:shadow-[var(--color-rt-primary)]/20"
          >
            Admin
          </RouterLink>
        </div>

        <!-- Mobile Hamburger -->
        <button
          class="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          @click="mobileOpen = !mobileOpen"
          :aria-label="mobileOpen ? 'Tutup menu' : 'Buka menu'"
        >
          <svg class="w-5 h-5 text-[var(--color-rt-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!mobileOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-96 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="max-h-96 opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <div v-if="mobileOpen" class="md:hidden overflow-hidden mt-3 pt-3 border-t border-gray-200/50">
          <div class="space-y-1 pb-3">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              :class="
                route.path === link.to || (link.to !== '/' && route.path.startsWith(link.to))
                  ? 'text-[var(--color-rt-primary)] bg-[var(--color-rt-accent)]/20'
                  : 'text-[var(--color-rt-secondary)] hover:text-[var(--color-rt-primary)] hover:bg-[var(--color-rt-light-alt)]'
              "
              @click="closeMobile"
            >
              {{ link.name }}
            </RouterLink>
            <RouterLink
              to="/admin/login"
              class="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--color-rt-primary)] text-center mt-2"
              @click="closeMobile"
            >
              Admin
            </RouterLink>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>
