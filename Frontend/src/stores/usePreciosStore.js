import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'
import { useUIStore } from './useUIStore'

const emptyPrecio = { name: '', percent: 0 }
const emptyError = { status: '', message: '', errors: [] }

export const usePreciosStore = create((set) => ({
  precios: [],
  preciosCombo: [],
  precio: emptyPrecio,
  error: emptyError,

  getPrecios: async (type = '') => {
    const URI = type === 'combo' ? '/pricelists/combo' : '/pricelists'
    try {
      const response = await api.get(URI)
      if (type === 'combo') {
        set({ preciosCombo: response.data.data })
      } else {
        set({ precios: response.data.data })
      }
      return response.data.data
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
      throw error
    }
  },

  setPrecio: (precio) => set({ precio }),

  resetPrecios: () => set({ error: emptyError, precio: emptyPrecio }),

  registerPriceList: async (pricelist) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.post('/pricelists', pricelist)
      await usePreciosStore.getState().getPrecios()
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  modifyPriceList: async (pricelist) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.put(`/pricelists/${pricelist.id}`, pricelist)
      await usePreciosStore.getState().getPrecios()
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  deletePriceList: async (pricelist) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/pricelists/${pricelist.id}`)
      await usePreciosStore.getState().getPrecios()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  restorePriceList: async (pricelist) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.post(`/pricelists/${pricelist.id}/restore`)
      await usePreciosStore.getState().getPrecios()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },
}))
