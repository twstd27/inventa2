import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'
import { useUIStore } from './useUIStore'

const emptyCategoria = { name: '', description: '' }
const emptyError = { status: '', message: '', errors: [] }

export const useCategoriasStore = create((set) => ({
  categorias: [],
  categoriasCombo: [],
  categoria: emptyCategoria,
  error: emptyError,

  getCategorias: async (type = '') => {
    const URI = type === 'combo' ? '/categories/combo' : '/categories'
    try {
      const response = await api.get(URI)
      if (type === 'combo') {
        set({ categoriasCombo: response.data.data })
      } else {
        set({ categorias: response.data.data })
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    }
  },

  setCategoria: (categoria) => set({ categoria }),

  resetCategorias: () => set({ error: emptyError, categoria: emptyCategoria }),

  registerCategory: async (category) => {
    const { startLoading, finishLoading, closeModal, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.post('/categories', category)
      await useCategoriasStore.getState().getCategorias()
      set({ error: emptyError })
      closeModal()
      addToast('success', 'Categoría creada correctamente')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al crear la categoría')
    } finally {
      finishLoading()
    }
  },

  modifyCategory: async (category) => {
    const { startLoading, finishLoading, closeModal, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.put(`/categories/${category.id}`, category)
      await useCategoriasStore.getState().getCategorias()
      set({ error: emptyError })
      closeModal()
      addToast('success', 'Categoría actualizada correctamente')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al actualizar la categoría')
    } finally {
      finishLoading()
    }
  },

  deleteCategory: async (category) => {
    const { startLoading, finishLoading, closeDialog, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/categories/${category.id}`)
      await useCategoriasStore.getState().getCategorias()
      set({ error: emptyError })
      closeDialog()
      addToast('success', 'Categoría eliminada')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al eliminar la categoría')
    } finally {
      finishLoading()
    }
  },

  restoreCategory: async (category) => {
    const { startLoading, finishLoading, closeDialog, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.post(`/categories/${category.id}/restore`)
      await useCategoriasStore.getState().getCategorias()
      set({ error: emptyError })
      closeDialog()
      addToast('success', 'Categoría restaurada')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al restaurar la categoría')
    } finally {
      finishLoading()
    }
  },
}))
