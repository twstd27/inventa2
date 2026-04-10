import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'
import { useUIStore } from './useUIStore'

const emptyError = { status: '', message: '', errors: [] }

export const useParamsStore = create((set) => ({
  params: [],
  error: emptyError,

  getParams: async () => {
    try {
      const response = await api.get('/params')
      set({ params: response.data.data })
      return response.data.data
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
      throw error
    }
  },

  modifyParam: async (id, value) => {
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      await api.put(`/params/${id}`, value)
      set({ error: emptyError })
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },
}))
