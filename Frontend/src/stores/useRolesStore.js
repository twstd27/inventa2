import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'
import { useUIStore } from './useUIStore'

const emptyRol = { name: '', permissions: '' }
const emptyError = { status: '', message: '', errors: [] }

export const useRolesStore = create((set) => ({
  roles: [],
  rolesCombo: [],
  rol: emptyRol,
  error: emptyError,
  modulos: [
    { value: 'POS', label: 'POS', modulo: 'ventas' },
    { value: 'cotizaciones', label: 'Cotizaciones', modulo: 'ventas' },
    { value: 'reportes', label: 'Reportes', modulo: 'ventas' },
    { value: 'productos', label: 'Administrar (Productos)', modulo: 'productos' },
    { value: 'categorias', label: 'Categorias', modulo: 'productos' },
    { value: 'etiquetas', label: 'Etiquetas', modulo: 'Ventas' },
    { value: 'marcas', label: 'Marcas', modulo: 'productos' },
    { value: 'entradas', label: 'Entradas de mercancía', modulo: 'stockMain' },
    { value: 'salidas', label: 'Salidas de mercancía', modulo: 'stockMain' },
    { value: 'usuarios', label: 'Usuarios', modulo: 'parametros' },
    { value: 'roles', label: 'Roles', modulo: 'parametros' },
    { value: 'sucursales', label: 'Sucursales', modulo: 'parametros' },
    { value: 'listaprecios', label: 'Lista de Precios', modulo: 'parametros' },
    { value: 'parametros', label: 'Parámetros del Sistema', modulo: 'parametros' },
    { value: 'todos', label: 'Todos los módulos' },
  ],

  getRoles: async (type = '') => {
    const URI = type === 'combo' ? '/roles/combo' : '/roles'
    try {
      const response = await api.get(URI)
      if (type === 'combo') {
        set({ rolesCombo: response.data.data })
      } else {
        set({ roles: response.data.data })
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    }
  },

  setRol: (rol) => set({ rol }),

  resetRoles: () => set({ error: emptyError, rol: emptyRol }),

  registerRole: async (role) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.post('/roles', role)
      await useRolesStore.getState().getRoles()
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  modifyRole: async (role) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      await api.put(`/roles/${role.id}`, role)
      await useRolesStore.getState().getRoles()
      set({ error: emptyError })
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  deleteRole: async (role) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/roles/${role.id}`)
      await useRolesStore.getState().getRoles()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  restoreRole: async (role) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.post(`/roles/${role.id}/restore`)
      await useRolesStore.getState().getRoles()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },
}))
