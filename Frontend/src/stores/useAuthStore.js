import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'

const emptyUsuario = { id: '', name: '', lastname: '', permissions: [], email: '', phone: '', role_id: '' }
const emptyError = { status: '', message: '', errors: [] }

export const useAuthStore = create(
  persist(
    (set) => ({
      logged: false,
      usuario: emptyUsuario,
      error: emptyError,

      startLogin: async (email, password) => {
        try {
          const response = await api.post('/login', { email, password })
          if (response.data.data.status === 'ok') {
            const { usuario, token, token_expires_at } = response.data.data
            if (token) {
              localStorage.setItem('token', token)
              if (token_expires_at) localStorage.setItem('token_expires_at', token_expires_at)
            }
            set({ logged: true, usuario, error: emptyError })
          } else {
            set({
              error: {
                status: 422,
                message: response.data.data.message,
                errors: [],
              },
            })
          }
        } catch (error) {
          if (import.meta.env.DEV) console.error('[dev] login error', error?.response?.status)
          set({ error: errorResponse(error) })
        }
      },

      startLogout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('token_expires_at')
        set({ logged: false, usuario: emptyUsuario })
        window.location.href = '/'
      },

      clearError: () => set({ error: emptyError }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ logged: state.logged, usuario: state.usuario }),
    },
  ),
)
