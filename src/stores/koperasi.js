import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useKoperasiStore = defineStore('koperasi', {
  state: () => ({
    warga: [],
    transaksi: [],
    pinjaman: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchWarga() {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.from('koperasi_warga').select('*').order('nama', { ascending: true })
        if (error) throw error
        this.warga = data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async addWarga(payload) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.from('koperasi_warga').insert([payload]).select()
        if (error) throw error
        this.warga.push(data[0])
        return data[0]
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },
    async fetchTransaksi() {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.from('koperasi_transaksi').select(`*, koperasi_warga(nama)`).order('tanggal', { ascending: false })
        if (error) throw error
        this.transaksi = data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async addTransaksi(payload) {
      this.loading = true
      this.error = null
      try {
        // payload: { warga_id, jenis, jumlah, keterangan }
        const { data, error } = await supabase.from('koperasi_transaksi').insert([payload]).select(`*, koperasi_warga(nama)`)
        if (error) throw error
        
        // Update total_simpanan and specific simpanan type
        const targetWarga = this.warga.find(w => w.id === payload.warga_id)
        if (targetWarga) {
          let newTotal = targetWarga.total_simpanan || 0
          let newPokok = targetWarga.simpanan_pokok || 0
          let newWajib = targetWarga.simpanan_wajib || 0
          let newSukarela = targetWarga.simpanan_sukarela || 0

          if (payload.jenis === 'Tarik') {
            newTotal -= payload.jumlah
            newSukarela -= payload.jumlah // Asumsi tarik hanya bisa ambil sukarela
          } else {
            newTotal += payload.jumlah
            if (payload.jenis === 'Pokok' || payload.jenis === 'pokok') newPokok += payload.jumlah
            if (payload.jenis === 'Wajib' || payload.jenis === 'wajib') newWajib += payload.jumlah
            if (payload.jenis === 'Sukarela' || payload.jenis === 'sukarela') newSukarela += payload.jumlah
          }

          const { error: updateError } = await supabase.from('koperasi_warga').update({ 
            total_simpanan: newTotal,
            simpanan_pokok: newPokok,
            simpanan_wajib: newWajib,
            simpanan_sukarela: newSukarela
          }).eq('id', payload.warga_id)
          if (updateError) throw updateError
          
          targetWarga.total_simpanan = newTotal
          targetWarga.simpanan_pokok = newPokok
          targetWarga.simpanan_wajib = newWajib
          targetWarga.simpanan_sukarela = newSukarela
        }
        
        this.transaksi.unshift(data[0])
        return data[0]
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },
    async fetchPinjaman() {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.from('koperasi_pinjaman').select(`*, koperasi_warga(nama)`).order('tanggal_pinjam', { ascending: false })
        if (error) throw error
        this.pinjaman = data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async addPinjaman(payload) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.from('koperasi_pinjaman').insert([payload]).select()
        if (error) throw error
        this.pinjaman.unshift(data[0])
        return { success: true, data: data[0] }
      } catch (err) {
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },
    async addAngsuran(payload) {
      this.loading = true
      this.error = null
      try {
        const targetPinjaman = this.pinjaman.find(p => p.id === payload.pinjaman_id)
        if (!targetPinjaman) throw new Error('Pinjaman not found')
        
        // 1. Catat ke tabel angsuran
        const { error: insertError } = await supabase.from('koperasi_angsuran').insert([{
          pinjaman_id: payload.pinjaman_id,
          jumlah_bayar: payload.jumlah_bayar
        }])
        if (insertError) throw insertError

        // 2. Update sisa tagihan di tabel pinjaman
        const newSisa = (targetPinjaman.sisa_tagihan || 0) - payload.jumlah_bayar
        let status = targetPinjaman.status
        if (newSisa <= 0) {
            status = 'lunas'
        }
        
        const { data, error: updateError } = await supabase.from('koperasi_pinjaman')
            .update({ sisa_tagihan: newSisa, status })
            .eq('id', payload.pinjaman_id)
            .select()
            
        if (updateError) throw updateError
        
        const index = this.pinjaman.findIndex(p => p.id === payload.pinjaman_id)
        if (index !== -1) {
            this.pinjaman[index] = data[0]
        }
        return { success: true, data: data[0] }
      } catch (err) {
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },
    async deleteWarga(id) {
      this.loading = true
      this.error = null
      try {
        const { error } = await supabase.from('koperasi_warga').delete().eq('id', id)
        if (error) throw error
        this.warga = this.warga.filter(w => w.id !== id)
        return { success: true }
      } catch (err) {
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },
    async deleteTransaksi(id) {
      this.loading = true
      this.error = null
      try {
        const transaksi = this.transaksi.find(t => t.id === id)
        if (!transaksi) throw new Error('Transaksi not found')

        // Revert the total in warga
        const targetWarga = this.warga.find(w => w.id === transaksi.warga_id)
        if (targetWarga) {
          let newTotal = targetWarga.total_simpanan || 0
          let newPokok = targetWarga.simpanan_pokok || 0
          let newWajib = targetWarga.simpanan_wajib || 0
          let newSukarela = targetWarga.simpanan_sukarela || 0

          if (transaksi.jenis === 'Tarik') {
            newTotal += transaksi.jumlah
            newSukarela += transaksi.jumlah
          } else {
            newTotal -= transaksi.jumlah
            if (transaksi.jenis === 'Pokok' || transaksi.jenis === 'pokok') newPokok -= transaksi.jumlah
            if (transaksi.jenis === 'Wajib' || transaksi.jenis === 'wajib') newWajib -= transaksi.jumlah
            if (transaksi.jenis === 'Sukarela' || transaksi.jenis === 'sukarela') newSukarela -= transaksi.jumlah
          }

          const { error: updateError } = await supabase.from('koperasi_warga').update({ 
            total_simpanan: newTotal,
            simpanan_pokok: newPokok,
            simpanan_wajib: newWajib,
            simpanan_sukarela: newSukarela
          }).eq('id', transaksi.warga_id)
          
          if (updateError) throw updateError

          targetWarga.total_simpanan = newTotal
          targetWarga.simpanan_pokok = newPokok
          targetWarga.simpanan_wajib = newWajib
          targetWarga.simpanan_sukarela = newSukarela
        }

        const { error: deleteError } = await supabase.from('koperasi_transaksi').delete().eq('id', id)
        if (deleteError) throw deleteError
        
        this.transaksi = this.transaksi.filter(t => t.id !== id)
        return { success: true }
      } catch (err) {
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },
    async deletePinjaman(id) {
      this.loading = true
      this.error = null
      try {
        const { error } = await supabase.from('koperasi_pinjaman').delete().eq('id', id)
        if (error) throw error
        this.pinjaman = this.pinjaman.filter(p => p.id !== id)
        return { success: true }
      } catch (err) {
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    }
  }
})
