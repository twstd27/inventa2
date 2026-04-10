import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'
import { useUIStore } from './useUIStore'

const emptyEntrada = { branch_id: '', type: '', doc_date: '', comments: '', branch: {}, entry_details: [] }
const emptyError = { status: '', message: '', errors: [] }

export const useStockStore = create((set) => ({
  entradas: [],
  salidas: [],
  paginaActual: 1,
  ultimaPagina: 1,
  totalEntradas: 0,
  totalSalidas: 0,
  entrada: emptyEntrada,
  error: emptyError,

  getEntradas: async (page = 1, limit = 5) => {
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      const response = await api.get(`/entries/entradas?page=${page}&limit=${limit}`)
      set({
        entradas: response.data.data,
        ultimaPagina: response.data.last_page,
        totalEntradas: response.data.total,
        paginaActual: response.data.current_page,
      })
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    } finally {
      finishLoading()
    }
  },

  getSalidas: async (page = 1, limit = 5) => {
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      const response = await api.get(`/entries/salidas?page=${page}&limit=${limit}`)
      set({
        salidas: response.data.data,
        ultimaPagina: response.data.last_page,
        totalSalidas: response.data.total,
        paginaActual: response.data.current_page,
      })
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    } finally {
      finishLoading()
    }
  },

  setEntrada: (entrada) => set({ entrada }),

  resetEntradas: () => set({ error: emptyError, entrada: emptyEntrada }),

  registerEntry: async (entry) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.post('/entries', entry)
      const store = useStockStore.getState()
      await store.getEntradas()
      await store.getSalidas()
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  modifyEntry: async (entry) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.put(`/entries/${entry.id}`, entry)
      const store = useStockStore.getState()
      await store.getEntradas()
      await store.getSalidas()
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  deleteEntry: async (entry) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/entries/${entry.id}`)
      await useStockStore.getState().getEntradas()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  restoreEntry: async (entry) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.post(`/entries/${entry.id}/restore`)
      await useStockStore.getState().getEntradas()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },
}))
