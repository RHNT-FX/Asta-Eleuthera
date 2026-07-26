import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    // ===== Public Routes =====
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: { title: 'Beranda — RT 27' },
        },
        {
          path: 'profil',
          name: 'profil',
          component: () => import('@/views/ProfileView.vue'),
          meta: { title: 'Profil — RT 27' },
        },
        {
          path: 'artikel',
          name: 'artikel',
          component: () => import('@/views/ArticleListView.vue'),
          meta: { title: 'Artikel — RT 27' },
        },
        {
          path: 'artikel/:slug',
          name: 'artikel-detail',
          component: () => import('@/views/ArticleDetailView.vue'),
          meta: { title: 'Artikel — RT 27' },
        },
        {
          path: 'modul',
          name: 'modul',
          component: () => import('@/views/ModuleView.vue'),
          meta: { title: 'Modul Pelatihan — RT 27' },
        },
      ],
    },

    // ===== Admin Routes =====
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/LoginView.vue'),
      meta: { title: 'Login Admin — RT 27' },
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
          meta: { title: 'Dashboard — Admin RT 27' },
        },
        {
          path: 'artikel',
          name: 'admin-artikel',
          component: () => import('@/views/admin/ArticleManageView.vue'),
          meta: { title: 'Kelola Artikel — Admin RT 27' },
        },
        {
          path: 'modul',
          name: 'admin-modul',
          component: () => import('@/views/admin/ModuleManageView.vue'),
          meta: { title: 'Kelola Modul — Admin RT 27' },
        },
        {
          path: 'profil',
          name: 'admin-profil',
          component: () => import('@/views/admin/ProfileManageView.vue'),
          meta: { title: 'Kelola Profil — Admin RT 27' },
        },
      ],
    },

    // ===== Koperasi Routes =====
    {
      path: '/koperasi/login',
      name: 'koperasi-login',
      component: () => import('@/views/koperasi/LoginView.vue'),
      meta: { title: 'Login Bendahara — RT 27' },
    },
    {
      path: '/koperasi',
      component: () => import('@/layouts/KoperasiLayout.vue'),
      meta: { requiresAuth: true, role: 'koperasi' },
      children: [
        {
          path: '',
          name: 'koperasi-dashboard',
          component: () => import('@/views/koperasi/DashboardView.vue'),
          meta: { title: 'Dashboard — Koperasi RT 27' },
        },
        {
          path: 'warga',
          name: 'koperasi-warga',
          component: () => import('@/views/koperasi/WargaView.vue'),
          meta: { title: 'Data Warga — Koperasi RT 27' },
        },
        {
          path: 'simpanan',
          name: 'koperasi-simpanan',
          component: () => import('@/views/koperasi/SimpananView.vue'),
          meta: { title: 'Simpanan — Koperasi RT 27' },
        },
        {
          path: 'pinjaman',
          name: 'koperasi-pinjaman',
          component: () => import('@/views/koperasi/PinjamanView.vue'),
          meta: { title: 'Pinjaman — Koperasi RT 27' },
        },
      ],
    },

    // ===== 404 =====
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Halaman Tidak Ditemukan — RT 27' },
    },
  ],
})

// Navigation Guard
router.beforeEach(async (to) => {
  // Update page title
  document.title = to.meta.title || 'RT 27'

  // Check auth for protected routes
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      if (to.meta.role === 'koperasi') {
        return { name: 'koperasi-login', query: { redirect: to.fullPath } }
      }
      return { name: 'admin-login', query: { redirect: to.fullPath } }
    }
  }
})

export default router