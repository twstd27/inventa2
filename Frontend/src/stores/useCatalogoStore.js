import { create } from 'zustand'
import axios from 'axios'

const publicApi = axios.create({ baseURL: import.meta.env.VITE_API_URL })

export const useCatalogoStore = create((set) => ({
  categories: [],
  products: [],
  params: {},
  loading: false,
  loadingMore: false,
  page: 1,
  hasMore: true,

  getCategories: async () => {
    set({ loading: true })
    try {
      const res = await publicApi.get('/catalogo/categories')
      set({ categories: res.data.data })
    } finally {
      set({ loading: false })
    }
  },

  getParams: async () => {
    try {
      const res = await publicApi.get('/catalogo/params')
      const map = {}
      res.data.data.forEach((p) => { map[p.name] = p.value })
      set({ params: map })
    } catch {}
  },

  getProducts: async (slug, page = 1) => {
    if (page === 1) {
      set({ loading: true })
    } else {
      set({ loadingMore: true })
    }
    try {
      const res = await publicApi.get(`/catalogo/${slug}/products?page=${page}`)
      const { data, current_page, last_page } = res.data
      set((state) => ({
        products: page === 1 ? data : [...state.products, ...data],
        page: current_page,
        hasMore: current_page < last_page,
      }))
    } finally {
      set({ loading: false, loadingMore: false })
    }
  },

  resetProducts: () => set({ products: [], page: 1, hasMore: true }),
}))
