# Portal Warga RT 27 — Website Profil & Informasi

![Vue Version](https://img.shields.io/badge/vue-3.5+-42b883)
![Vite](https://img.shields.io/badge/vite-7.x-646cff)
![Tailwind](https://img.shields.io/badge/tailwindcss-4.x-38b2ac)
![Supabase](https://img.shields.io/badge/database-supabase-3ecf8e)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Tentang Proyek

**Portal Warga RT 27** adalah website profil resmi untuk lingkungan RT 27. Website ini berfungsi sebagai pusat informasi bagi warga, menyediakan profil lengkap RT, artikel & berita terkini, serta modul pelatihan penanaman bawang dayak yang dapat diunduh secara gratis.

Proyek ini dikembangkan sebagai bagian dari program **KKN (Kuliah Kerja Nyata)** untuk memberdayakan masyarakat melalui teknologi informasi.

## ✨ Fitur Utama

### 🏠 Halaman Publik
- **Beranda** — Hero section, preview tentang RT 27, artikel terbaru, modul pelatihan, peta lokasi (Leaflet), dan CTA kontak.
- **Profil RT** — Visi & misi, sejarah, struktur pengurus, dan galeri kegiatan dengan lightbox.
- **Artikel & Berita** — Daftar artikel dengan pencarian, filter kategori, dan pagination. Detail artikel mendukung format Markdown.
- **Modul Pelatihan** — Halaman unduh modul pelatihan budidaya bawang dayak dan materi edukasi lainnya.
- **Halaman 404** — Halaman error yang informatif.

### 🔒 Panel Admin
- **Login Admin** — Autentikasi via Supabase Auth dengan desain glassmorphism.
- **Dashboard** — Statistik ringkasan (total artikel, modul, unduhan) dan aksi cepat.
- **Kelola Artikel** — CRUD artikel dengan dukungan Markdown, kategori, thumbnail, dan status draft/published.
- **Kelola Modul** — Upload dan kelola modul pelatihan (PDF).
- **Kelola Profil RT** — Edit visi misi, sejarah, struktur pengurus, kontak & alamat, dan galeri kegiatan.

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework** | [Vue.js 3](https://vuejs.org/) (Composition API & Script Setup) |
| **Build Tool** | [Vite 7](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [DaisyUI 5](https://daisyui.com/) |
| **State Management** | [Pinia](https://pinia.vuejs.org/) |
| **Routing** | [Vue Router 4](https://router.vuejs.org/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage) |
| **Peta** | [Leaflet.js](https://leafletjs.com/) + OpenStreetMap |
| **Markdown** | [Marked](https://marked.js.org/) |
| **Font** | Plus Jakarta Sans (Body), Playfair Display (Heading) |

## 📁 Struktur Folder

```text
src/
├── assets/              # CSS Global (style.css)
├── components/
│   ├── common/          # Navbar, Footer, LoadingSpinner
│   ├── home/            # HeroSection, AboutPreview, LatestArticles, dll.
│   └── profile/         # VisiMisi, Sejarah, Pengurus, Gallery
├── layouts/             # PublicLayout, AdminLayout
├── lib/                 # Supabase client
├── router/              # Konfigurasi route & auth guard
├── stores/              # Pinia stores (auth, article, module, profile)
├── views/
│   ├── admin/           # Login, Dashboard, ArticleManage, ModuleManage, ProfileManage
│   ├── HomeView.vue
│   ├── ProfileView.vue
│   ├── ArticleListView.vue
│   ├── ArticleDetailView.vue
│   ├── ModuleView.vue
│   └── NotFoundView.vue
└── App.vue
```

## ⚙️ Cara Menjalankan

### Prasyarat
- **Node.js** (v18+ disarankan)
- **NPM** atau **Yarn**
- **Akun Supabase** (gratis di [supabase.com](https://supabase.com))

### Instalasi

```bash
# Clone repository
git clone <repo-url>
cd Asta-Eleuthera

# Install dependencies
npm install

# Buat file .env di root project
cp .env.example .env
```

### Konfigurasi Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Salin **URL** dan **Anon Key** dari Dashboard → Settings → API
3. Isi file `.env`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx...
```

4. Buat user admin di Supabase Dashboard → Authentication → Users → Add User

### Menjalankan Development Server

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

### Build untuk Production

```bash
npm run build
```

## 🎨 Tema Warna

| Warna | Kode | Kegunaan |
|---|---|---|
| Primary | `#354F38` | Warna utama (Army Green) |
| Secondary | `#5F7161` | Warna pendukung |
| Accent | `#A8C5A0` | Warna aksen (hijau muda) |
| Dark | `#1F291F` | Teks utama & background gelap |
| Light | `#F4F7F5` | Background utama |

## 📄 Lisensi

Proyek ini didistribusikan di bawah lisensi **MIT**. Lihat file `LICENSE` untuk informasi lebih lanjut.

---
© 2025 Portal Warga RT 27. Dibuat dengan ❤️ oleh azrlb — Program KKN.