import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'
import { useUIStore } from './useUIStore'

const emptyTipoDeCambio = { description: '', value: 0 }
const emptyError = { status: '', message: '', errors: [] }

export const useTipoDeCambioStore = create((set) => ({
  tiposDeCambio: [],
  tiposDeCambioCombo: [],
  tipoDeCambio: emptyTipoDeCambio,
  error: emptyError,

  getTiposDeCambio: async (type = '') => {
    const URI = type === 'combo' ? '/exchangerates/combo' : '/exchangerates'
    try {
      const response = await api.get(URI)
      if (type === 'combo') {
        set({ tiposDeCambioCombo: response.data.data })
      } else {
        set({ tiposDeCambio: response.data.data })
      }
      return response.data.data
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
      throw error
    }
  },

  setTipoDeCambio: (tipoDeCambio) => set({ tipoDeCambio }),

  resetTipoDeCambio: () => set({ error: emptyError, tipoDeCambio: emptyTipoDeCambio }),

  registerTipoDeCambio: async (data) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.post('/exchangerates', data)
      await useTipoDeCambioStore.getState().getTiposDeCambio()
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  modifyTipoDeCambio: async (data) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.put(`/exchangerates/${data.id}`, data)
      await useTipoDeCambioStore.getState().getTiposDeCambio()
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  deleteTipoDeCambio: async (item) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/exchangerates/${item.id}`)
      await useTipoDeCambioStore.getState().getTiposDeCambio()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  restoreTipoDeCambio: async (item) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.post(`/exchangerates/${item.id}/restore`)
      await useTipoDeCambioStore.getState().getTiposDeCambio()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },
}))
