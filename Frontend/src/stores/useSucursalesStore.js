import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'
import { useUIStore } from './useUIStore'

const emptySucursal = { name: '', address: '', phone: '' }
const emptyError = { status: '', message: '', errors: [] }

export const useSucursalesStore = create((set) => ({
  sucursales: [],
  sucursalesCombo: [],
  sucursal: emptySucursal,
  error: emptyError,

  getSucursales: async (type = '') => {
    const URI = type === 'combo' ? '/branches/combo' : '/branches'
    try {
      const response = await api.get(URI)
      if (type === 'combo') {
        set({ sucursalesCombo: response.data.data })
      } else {
        set({ sucursales: response.data.data })
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    }
  },

  setSucursal: (sucursal) => set({ sucursal }),

  resetSucursales: () => set({ error: emptyError, sucursal: emptySucursal }),

  registerBranch: async (branch) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.post('/branches', branch)
      await useSucursalesStore.getState().getSucursales()
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  modifyBranch: async (branch) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.put(`/branches/${branch.id}`, branch)
      await useSucursalesStore.getState().getSucursales()
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  deleteBranch: async (branch) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/branches/${branch.id}`)
      await useSucursalesStore.getState().getSucursales()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  restoreBranch: async (branch) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.post(`/branches/${branch.id}/restore`)
      await useSucursalesStore.getState().getSucursales()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },
}))
