import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'
import { useUIStore } from './useUIStore'

const emptyVenta = { branch_id: '', doc_date: '', comments: '', branch: {}, sale_details: [] }
const emptyError = { status: '', message: '', errors: [] }

export const useVentasStore = create((set) => ({
  ventas: [],
  diario: [],
  paginaActual: 1,
  ultimaPagina: 1,
  totalVentas: 0,
  venta: emptyVenta,
  ventaImp: emptyVenta,
  error: emptyError,

  getVentas: async (type = '', page = 1, limit = 5, search = '', trashed = false, startDate = '', endDate = '', invoice = '') => {
    let URI = type === 'lista' ? '/sales/lista' : `/sales?page=${page}&limit=${limit}`
    if (type !== 'lista') {
      if (search) URI += `&search=${encodeURIComponent(search)}`
      if (trashed) URI += `&trashed=1`
      if (startDate) URI += `&start_date=${startDate}`
      if (endDate) URI += `&end_date=${endDate}`
      if (invoice) URI += `&invoice=${invoice}`
    }
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      const response = await api.get(URI)
      set({
        ventas: response.data.data,
        ultimaPagina: response.data.last_page,
        totalVentas: response.data.total,
        paginaActual: response.data.current_page,
      })
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    } finally {
      finishLoading()
    }
  },

  getVenta: async (id, type = '') => {
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      const response = await api.get(`/sales/${id}`)
      if (type === 'imp') {
        set({ ventaImp: response.data.data })
      } else {
        set({ venta: response.data.data })
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    } finally {
      finishLoading()
    }
  },

  setVenta: (venta) => set({ venta }),

  resetVentas: () => set({ error: emptyError, venta: emptyVenta }),

  registerSale: async (sale) => {
    const { startLoading, finishLoading, closeDialog, addToast } = useUIStore.getState()
    startLoading()
    delete sale.doc_date
    try {
      const response = await api.post('/sales', sale)
      if (response.status === 201) {
        await useVentasStore.getState().getVentas()
        set({ error: emptyError })
        addToast('success', 'Venta registrada correctamente')
      }
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al registrar la venta')
    } finally {
      finishLoading()
    }
  },

  deleteSale: async (sale) => {
    const { startLoading, finishLoading, closeDialog, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/sales/${sale.id}`)
      await useVentasStore.getState().getVentas()
      set({ error: emptyError })
      closeDialog()
      addToast('success', 'Venta eliminada')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al eliminar la venta')
    } finally {
      finishLoading()
    }
  },

  getDiario: async (data = {}) => {
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      const response = await api.get(
        `/sales/diario?start_date=${data.startDate}&end_date=${data.endDate}&b=${data.sucursal}`,
      )
      set({ diario: response.data.data })
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    } finally {
      finishLoading()
    }
  },
}))
