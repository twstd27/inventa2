import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { useUIStore } from './useUIStore'

export const useAuditStore = create((set) => ({
  logs: [],
  paginaActual: 1,
  ultimaPagina: 1,
  total: 0,

  getLogs: async (filters = {}, page = 1, perPage = 50) => {
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      const params = new URLSearchParams({ per_page: perPage, page, ...filters })
      const response = await api.get(`/auditlogs?${params}`)
      set({
        logs: response.data.data,
        paginaActual: response.data.current_page,
        ultimaPagina: response.data.last_page,
        total: response.data.total,
      })
    } catch (error) {
      if (import.meta.env.DEV) console.error('[audit]', error?.response?.status)
    } finally {
      finishLoading()
    }
  },
}))
