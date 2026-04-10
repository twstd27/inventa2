import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'
import { useUIStore } from './useUIStore'

const emptyCotizacion = { customer: '', branch_id: '', doc_date: '', comments: '', branch: {}, quotation_details: [] }
const emptyError = { status: '', message: '', errors: [] }

export const useCotizacionesStore = create((set) => ({
  cotizaciones: [],
  cotizacion: emptyCotizacion,
  cotizacionImp: emptyCotizacion,
  error: emptyError,

  getCotizaciones: async (type = '') => {
    const URI = type === 'lista' ? '/quotations/lista' : '/quotations'
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      const response = await api.get(URI)
      set({ cotizaciones: response.data.data })
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    } finally {
      finishLoading()
    }
  },

  getCotizacion: async (id, type = '') => {
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      const response = await api.get(`/quotations/${id}`)
      if (type === 'imp') {
        set({ cotizacionImp: response.data.data })
      } else {
        set({ cotizacion: response.data.data })
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    } finally {
      finishLoading()
    }
  },

  setCotizacion: (cotizacion) => set({ cotizacion }),

  resetCotizaciones: () => set({ error: emptyError, cotizacion: emptyCotizacion }),

  registerQuotation: async (sale) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    delete sale.doc_date
    try {
      const response = await api.post('/quotations', sale)
      if (response.status === 201) {
        await useCotizacionesStore.getState().getCotizaciones()
        set({ error: emptyError })
      }
      closeDialog()
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },
}))
