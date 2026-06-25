<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const kontak = profileStore.getProfileValue('kontak')
const currentYear = new Date().getFullYear()

const subscribed = ref(false)
const email = ref('')

function handleSubscribe() {
  if (!email.value) return
  subscribed.value = true
  email.value = ''
  setTimeout(() => {
    subscribed.value = false
  }, 3000)
}

const quickLinks = [
  { name: 'Beranda', to: '/' },
  { name: 'Profil RT', to: '/profil' },
  { name: 'Artikel', to: '/artikel' },
  { name: 'Modul Pelatihan', to: '/modul' },
]

const socialLinks = [
  { name: 'Facebook', icon: 'facebook', href: '#' },
  { name: 'Instagram', icon: 'instagram', href: '#' },
  { name: 'WhatsApp', icon: 'whatsapp', href: `https://wa.me/${kontak?.whatsapp || '6281234567890'}` },
]
</script>

<template>
  <footer class="bg-[var(--color-rt-dark)] text-white/80">
    <!-- Main Footer -->
    <div class="max-w-7xl mx-auto px-6 pt-16 pb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        <!-- Brand -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3 mb-4">
            <img src="/images/AE1.png" alt="Logo" class="w-10 h-10 rounded-xl" />
            <div>
              <h3 class="text-white font-bold text-lg tracking-tight" style="font-family: var(--font-sans);">RT 27</h3>
              <p class="text-white/40 text-xs">Portal Warga</p>
            </div>
          </div>
          <p class="text-sm leading-relaxed text-white/50 mb-4">
            Website resmi RT 27. Portal informasi, artikel, dan layanan untuk seluruh warga.
          </p>
          <!-- Social -->
          <div class="flex items-center gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              :title="social.name"
              target="_blank"
              rel="noopener"
              class="w-9 h-9 rounded-xl bg-white/5 hover:bg-[var(--color-rt-primary)] flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <!-- Facebook -->
              <svg v-if="social.icon === 'facebook'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <!-- Instagram -->
              <svg v-else-if="social.icon === 'instagram'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <!-- WhatsApp -->
              <svg v-else-if="social.icon === 'whatsapp'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-semibold text-sm mb-4 uppercase tracking-wider" style="font-family: var(--font-sans);">
            Navigasi
          </h4>
          <ul class="space-y-2.5">
            <li v-for="link in quickLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-sm text-white/50 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-white font-semibold text-sm mb-4 uppercase tracking-wider" style="font-family: var(--font-sans);">
            Kontak
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start gap-2.5">
              <svg class="w-4 h-4 mt-0.5 text-[var(--color-rt-accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-sm text-white/50">{{ kontak?.address || 'RT 27, Kalimantan Timur' }}</span>
            </li>
            <li class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[var(--color-rt-accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a :href="`tel:${kontak?.phone || '+62 812-3456-7890'}`" class="text-sm text-white/50 hover:text-white transition-colors">
                {{ kontak?.phone || '+62 812-3456-7890' }}
              </a>
            </li>
            <li class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[var(--color-rt-accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a :href="`mailto:${kontak?.email || 'rt27@example.com'}`" class="text-sm text-white/50 hover:text-white transition-colors">
                {{ kontak?.email || 'rt27@example.com' }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-white font-semibold text-sm mb-4 uppercase tracking-wider" style="font-family: var(--font-sans);">
            Info Terbaru
          </h4>
          <p class="text-sm text-white/50 mb-4">
            Dapatkan informasi terbaru dari RT 27 langsung ke email Anda.
          </p>
          <form @submit.prevent="handleSubscribe" class="space-y-2">
            <input
              v-model="email"
              type="email"
              placeholder="Email Anda"
              class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-rt-accent)] transition-colors"
            />
            <button
              type="submit"
              class="w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              :class="
                subscribed
                  ? 'bg-green-500/20 text-green-400 cursor-default'
                  : 'bg-[var(--color-rt-primary)] text-white hover:bg-[var(--color-rt-primary-light)]'
              "
              :disabled="subscribed"
            >
              {{ subscribed ? '✓ Terdaftar!' : 'Berlangganan' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-white/5">
      <div class="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-white/30">
          © {{ currentYear }} RT 27. Dibangun dengan ❤️
        </p>
        <p class="text-xs text-white/20">
          Portal Informasi Warga
        </p>
      </div>
    </div>
  </footer>
</template>
