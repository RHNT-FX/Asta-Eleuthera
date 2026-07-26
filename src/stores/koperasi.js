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
        const { data, error } = await supabase.from('koperasi_transaksi').select(`*, koperasi_warga(nama)`).order('created_at', { ascending: false })
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
        // payload: { warga_id, jenis, nominal, keterangan }
        const { data, error } = await supabase.from('koperasi_transaksi').insert([payload]).select(`*, koperasi_warga(nama)`)
        if (error) throw error
        
        // Update total_simpanan
        const targetWarga = this.warga.find(w => w.id === payload.warga_id)
        if (targetWarga) {
          let newTotal = targetWarga.total_simpanan || 0
          if (payload.jenis === 'Tarik') {
            newTotal -= payload.nominal
          } else {
            newTotal += payload.nominal
          }
          const { error: updateError } = await supabase.from('koperasi_warga').update({ total_simpanan: newTotal }).eq('id', payload.warga_id)
          if (updateError) throw updateError
          targetWarga.total_simpanan = newTotal
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
        const { data, error } = await supabase.from('koperasi_pinjaman').select(`*, koperasi_warga(nama)`).order('created_at', { ascending: false })
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
        const { data, error } = await supabase.from('koperasi_pinjaman').insert([payload]).select(`*, koperasi_warga(nama)`)
        if (error) throw error
        this.pinjaman.unshift(data[0])
        return data[0]
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },
    async addAngsuran(pinjamanId, nominal) {
      this.loading = true
      this.error = null
      try {
        const targetPinjaman = this.pinjaman.find(p => p.id === pinjamanId)
        if (!targetPinjaman) throw new Error('Pinjaman not found')
        
        const newTerbayar = (targetPinjaman.terbayar || 0) + nominal
        let status = targetPinjaman.status
        if (newTerbayar >= targetPinjaman.total_pinjaman) {
            status = 'Lunas'
        }
        
        const { data, error } = await supabase.from('koperasi_pinjaman')
            .update({ terbayar: newTerbayar, status })
            .eq('id', pinjamanId)
            .select(`*, koperasi_warga(nama)`)
            
        if (error) throw error
        
        const index = this.pinjaman.findIndex(p => p.id === pinjamanId)
        if (index !== -1) {
            this.pinjaman[index] = data[0]
        }
        return data[0]
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
