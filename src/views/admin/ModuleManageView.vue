<script setup>
import { ref, onMounted } from 'vue'
import { useModuleStore } from '@/stores/module'

const moduleStore = useModuleStore()

// State
const modules = ref([])
const loading = ref(true)
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedModule = ref(null)

// Form State
const formData = ref({
  id: null,
  title: '',
  category: 'Modul',
  description: '',
  file_url: '',
  file_size: '',
})
const fileInput = ref(null)

onMounted(async () => {
  await loadModules()
})

async function loadModules() {
  loading.value = true
  try {
    await moduleStore.fetchModules() 
    modules.value = moduleStore.modules
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function openModal(mod = null) {
  if (mod) {
    formData.value = { ...mod }
  } else {
    formData.value = {
      id: null,
      title: '',
      category: moduleStore.categories[0],
      description: '',
      file_url: '',
      file_size: '',
    }
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function saveModule() {
  console.log('Saving module:', formData.value)
  // Simulate network
  await new Promise(r => setTimeout(r, 500))
  closeModal()
  await loadModules()
}

function confirmDelete(mod) {
  selectedModule.value = mod
  isDeleteModalOpen.value = true
}

async function deleteModule() {
  if (!selectedModule.value) return
  console.log('Deleting module:', selectedModule.value.id)
  // Simulate network
  await new Promise(r => setTimeout(r, 500))
  isDeleteModalOpen.value = false
  selectedModule.value = null
  await loadModules()
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-rt-dark)]">Kelola Modul</h1>
        <p class="text-gray-500 text-sm mt-1">Upload dan kelola modul pelatihan warga.</p>
      </div>
      <button 
        @click="openModal()"
        class="bg-[var(--color-rt-primary)] hover:bg-[var(--color-rt-primary-light)] text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload Modul
      </button>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
              <th class="px-6 py-4 font-medium">Judul Modul</th>
              <th class="px-6 py-4 font-medium">Kategori</th>
              <th class="px-6 py-4 font-medium">Ukuran File</th>
              <th class="px-6 py-4 font-medium">Unduhan</th>
              <th class="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-10 text-center text-gray-500">Memuat data...</td>
            </tr>
            <tr v-else-if="modules.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-gray-500">Belum ada modul.</td>
            </tr>
            <tr v-else v-for="mod in modules" :key="mod.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-[var(--color-rt-accent)]/20 text-[var(--color-rt-primary)] flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-bold text-[var(--color-rt-dark)] line-clamp-1">{{ mod.title }}</p>
                    <p class="text-xs text-gray-500 mt-0.5 line-clamp-1 w-48 lg:w-64">{{ mod.description }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                  {{ mod.category }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-500">
                {{ mod.file_size || 'Unknown' }}
              </td>
              <td class="px-6 py-4 text-gray-500">
                {{ mod.download_count || 0 }} kali
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <a 
                    v-if="mod.file_url"
                    :href="mod.file_url"
                    target="_blank"
                    class="p-2 text-gray-400 hover:text-[var(--color-rt-primary)] hover:bg-[var(--color-rt-primary)]/10 rounded-lg transition-colors"
                    title="Buka / Download"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <button 
                    @click="openModal(mod)"
                    class="p-2 text-gray-400 hover:text-[var(--color-rt-primary)] hover:bg-[var(--color-rt-light-alt)] rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(mod)"
                    class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Form Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          <form @submit.prevent="saveModule">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
              <h3 class="text-lg leading-6 font-medium text-[var(--color-rt-dark)]" id="modal-title">
                {{ formData.id ? 'Edit Modul' : 'Upload Modul Baru' }}
              </h3>
            </div>
            
            <div class="px-4 py-5 sm:p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Judul Modul</label>
                <input v-model="formData.title" type="text" required class="w-full rounded-xl border-gray-200 focus:border-[var(--color-rt-primary)] focus:ring-[var(--color-rt-primary)]/20 shadow-sm px-4 py-2 border" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select v-model="formData.category" required class="w-full rounded-xl border-gray-200 focus:border-[var(--color-rt-primary)] focus:ring-[var(--color-rt-primary)]/20 shadow-sm px-4 py-2 border bg-white">
                  <option v-for="cat in moduleStore.categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea v-model="formData.description" rows="3" required class="w-full rounded-xl border-gray-200 focus:border-[var(--color-rt-primary)] focus:ring-[var(--color-rt-primary)]/20 shadow-sm px-4 py-2 border"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">File PDF (atau URL File)</label>
                <!-- Placeholder for actual file upload to storage -->
                <input v-model="formData.file_url" type="url" placeholder="https://link-ke-file-pdf.com" class="w-full rounded-xl border-gray-200 focus:border-[var(--color-rt-primary)] focus:ring-[var(--color-rt-primary)]/20 shadow-sm px-4 py-2 border mb-2" />
                <p class="text-xs text-gray-500">Catatan: Untuk saat ini masukkan URL file secara manual jika tidak menggunakan storage terintegrasi.</p>
              </div>
              
              <div v-if="formData.id">
                <label class="block text-sm font-medium text-gray-700 mb-1">Ukuran File (Opsional)</label>
                <input v-model="formData.file_size" type="text" placeholder="2.5 MB" class="w-full rounded-xl border-gray-200 focus:border-[var(--color-rt-primary)] focus:ring-[var(--color-rt-primary)]/20 shadow-sm px-4 py-2 border" />
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
              <button type="submit" class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-2.5 bg-[var(--color-rt-primary)] text-base font-medium text-white hover:bg-[var(--color-rt-primary-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-rt-primary)] sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                Simpan
              </button>
              <button type="button" @click="closeModal" class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" @click="isDeleteModalOpen = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Hapus Modul
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Apakah Anda yakin ingin menghapus modul "<span class="font-bold">{{ selectedModule?.title }}</span>"?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
            <button @click="deleteModule" type="button" class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-2.5 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors">
              Ya, Hapus
            </button>
            <button @click="isDeleteModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
