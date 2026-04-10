import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'
import { useUIStore } from './useUIStore'

const emptyMarca = { name: '', description: '' }
const emptyError = { status: '', message: '', errors: [] }

export const useMarcasStore = create((set) => ({
  marcas: [],
  marcasCombo: [],
  marca: emptyMarca,
  error: emptyError,

  getMarcas: async (type = '') => {
    const URI = type === 'combo' ? '/brands/combo' : '/brands'
    try {
      const response = await api.get(URI)
      if (type === 'combo') {
        set({ marcasCombo: response.data.data })
      } else {
        set({ marcas: response.data.data })
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    }
  },

  setMarca: (marca) => set({ marca }),

  resetMarcas: () => set({ error: emptyError, marca: emptyMarca }),

  registerBrand: async (brand) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.post('/brands', brand)
      await useMarcasStore.getState().getMarcas()
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  modifyBrand: async (brand) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.put(`/brands/${brand.id}`, brand)
      await useMarcasStore.getState().getMarcas()
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  deleteBrand: async (brand) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/brands/${brand.id}`)
      await useMarcasStore.getState().getMarcas()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  restoreBrand: async (brand) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.post(`/brands/${brand.id}/restore`)
      await useMarcasStore.getState().getMarcas()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },
}))
