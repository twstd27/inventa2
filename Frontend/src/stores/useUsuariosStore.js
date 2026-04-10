import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'
import { useUIStore } from './useUIStore'

const emptyUsuario = { name: '', lastname: '', email: '', phone: '', role_id: '', rol: '' }
const emptyError = { status: '', message: '', errors: [] }

export const useUsuariosStore = create((set) => ({
  usuarios: [],
  usuario: emptyUsuario,
  error: emptyError,

  getUsuarios: async (type = '') => {
    const URI = type === 'lista' ? '/users/lista' : '/users'
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      const response = await api.get(URI)
      set({ usuarios: response.data.data })
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    } finally {
      finishLoading()
    }
  },

  setUsuario: (usuario) => set({ usuario }),

  resetUsuarios: () => set({ error: emptyError, usuario: emptyUsuario }),

  registerUser: async (user) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.post('/users', user)
      await useUsuariosStore.getState().getUsuarios('lista')
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  modifyUser: async (user) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.put(`/users/${user.id}`, user)
      await useUsuariosStore.getState().getUsuarios('lista')
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  deleteUser: async (user) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/users/${user.id}`)
      await useUsuariosStore.getState().getUsuarios('lista')
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  restoreUser: async (user) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.post(`/users/${user.id}/restore`)
      await useUsuariosStore.getState().getUsuarios('lista')
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },
}))
