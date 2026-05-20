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

  getEntradas: async (page = 1, limit = 5, search = '', trashed = false, startDate = '', endDate = '', code = '') => {
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      let url = `/entries/entradas?page=${page}&limit=${limit}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (trashed) url += `&trashed=1`
      if (startDate) url += `&start_date=${startDate}`
      if (endDate) url += `&end_date=${endDate}`
      if (code) url += `&code=${encodeURIComponent(code)}`
      const response = await api.get(url)
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

  getSalidas: async (page = 1, limit = 5, search = '', trashed = false, startDate = '', endDate = '', code = '') => {
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      let url = `/entries/salidas?page=${page}&limit=${limit}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (trashed) url += `&trashed=1`
      if (startDate) url += `&start_date=${startDate}`
      if (endDate) url += `&end_date=${endDate}`
      if (code) url += `&code=${encodeURIComponent(code)}`
      const response = await api.get(url)
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
    const { startLoading, finishLoading, closeModal, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.post('/entries', entry)
      const store = useStockStore.getState()
      await store.getEntradas()
      await store.getSalidas()
      set({ error: emptyError })
      closeModal()
      addToast('success', 'Movimiento de stock registrado')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al registrar el movimiento')
    } finally {
      finishLoading()
    }
  },

  modifyEntry: async (entry) => {
    const { startLoading, finishLoading, closeModal, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.put(`/entries/${entry.id}`, entry)
      const store = useStockStore.getState()
      await store.getEntradas()
      await store.getSalidas()
      set({ error: emptyError })
      closeModal()
      addToast('success', 'Movimiento actualizado correctamente')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al actualizar el movimiento')
    } finally {
      finishLoading()
    }
  },

  deleteEntry: async (entry) => {
    const { startLoading, finishLoading, closeDialog, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/entries/${entry.id}`)
      await useStockStore.getState().getEntradas()
      set({ error: emptyError })
      closeDialog()
      addToast('success', 'Movimiento eliminado')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al eliminar el movimiento')
    } finally {
      finishLoading()
    }
  },

  restoreEntry: async (entry) => {
    const { startLoading, finishLoading, closeDialog, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.post(`/entries/${entry.id}/restore`)
      await useStockStore.getState().getEntradas()
      set({ error: emptyError })
      closeDialog()
      addToast('success', 'Movimiento restaurado')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al restaurar el movimiento')
    } finally {
      finishLoading()
    }
  },
}))
