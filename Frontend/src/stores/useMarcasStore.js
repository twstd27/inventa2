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
    const { startLoading, finishLoading, closeModal, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.post('/brands', brand)
      await useMarcasStore.getState().getMarcas()
      set({ error: emptyError })
      closeModal()
      addToast('success', 'Marca creada correctamente')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al crear la marca')
    } finally {
      finishLoading()
    }
  },

  modifyBrand: async (brand) => {
    const { startLoading, finishLoading, closeModal, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.put(`/brands/${brand.id}`, brand)
      await useMarcasStore.getState().getMarcas()
      set({ error: emptyError })
      closeModal()
      addToast('success', 'Marca actualizada correctamente')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al actualizar la marca')
    } finally {
      finishLoading()
    }
  },

  deleteBrand: async (brand) => {
    const { startLoading, finishLoading, closeDialog, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/brands/${brand.id}`)
      await useMarcasStore.getState().getMarcas()
      set({ error: emptyError })
      closeDialog()
      addToast('success', 'Marca eliminada')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al eliminar la marca')
    } finally {
      finishLoading()
    }
  },

  restoreBrand: async (brand) => {
    const { startLoading, finishLoading, closeDialog, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.post(`/brands/${brand.id}/restore`)
      await useMarcasStore.getState().getMarcas()
      set({ error: emptyError })
      closeDialog()
      addToast('success', 'Marca restaurada')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al restaurar la marca')
    } finally {
      finishLoading()
    }
  },
}))
