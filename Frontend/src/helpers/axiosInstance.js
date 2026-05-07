import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isLoggingOut = false

const forceLogout = () => {
  if (isLoggingOut) return
  isLoggingOut = true
  localStorage.removeItem('token')
  localStorage.removeItem('auth-storage')
  delete api.defaults.headers.common.Authorization
  window.location.href = '/#/login'
  setTimeout(() => { isLoggingOut = false }, 2000)
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      forceLogout()
    }
    return Promise.reject(error)
  },
)

export default api
