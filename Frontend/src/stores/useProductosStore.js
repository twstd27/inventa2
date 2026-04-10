import { create } from 'zustand'
import api from '../helpers/axiosInstance'
import { errorResponse } from '../helpers/global'
import { useUIStore } from './useUIStore'

const emptyProducto = {
  code: '', name: '', price: 0, price_discount: 0, price_wholesome: 0,
  price_type: 0, cost: 0, description: '', brand_id: '', marca: '',
  price_percent: 0, wholesome_percent: 0, discount_percent: 0,
  cost_usd: 0, exchange_rate_id: null, images: [], categories: [],
}
const emptyError = { status: '', message: '', errors: [] }

export const useProductosStore = create((set) => ({
  productos: [],
  productosCombo: [],
  productosEtiqueta: [],
  paginaActual: 1,
  ultimaPagina: 1,
  totalProductos: 0,
  producto: emptyProducto,
  error: emptyError,

  getProductos: async (type = '', data = {}, page = 1, limit = 5) => {
    let URI = ''
    switch (type) {
      case 'combo': URI = '/products/combo'; break
      case 'busqueda': URI = `/products?q=${data.buscar}&b=${data.sucursal}`; break
      case 'etiquetas': URI = '/products/etiquetas'; break
      default:
        URI = `/products/lista?page=${page}&limit=${limit}`
        if (data.search) URI += `&search=${encodeURIComponent(data.search)}`
        break
    }
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      const response = await api.get(URI)
      switch (type) {
        case 'combo':
          set({ productosCombo: response.data.data }); break
        case 'busqueda':
          set({ productos: response.data.data, paginaActual: 1, ultimaPagina: 10, totalProductos: 10 }); break
        case 'etiquetas':
          set({ productosEtiqueta: response.data.data }); break
        default:
          set({
            productos: response.data.data,
            ultimaPagina: response.data.last_page,
            totalProductos: response.data.total,
            paginaActual: response.data.current_page,
          })
          break
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('[dev]', error?.response?.status)
    } finally {
      finishLoading()
    }
  },

  getProducto: async (code) => {
    const { startLoading, finishLoading } = useUIStore.getState()
    startLoading()
    try {
      const response = await api.get(`/products/${code}`)
      if (response.status === 200) set({ producto: response.data.producto })
    } catch (error) {
      if (error.response?.status === 404) {
        set({ error: { status: '404', message: 'Producto no encontrado', errors: [] } })
      }
    } finally {
      finishLoading()
    }
  },

  setProducto: (producto) => set({ producto }),

  resetProductos: () => set({ error: emptyError, producto: emptyProducto }),

  resetProductosLista: () => set({ productos: [] }),

  registerProduct: async (product, files) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      const response = await api.post('/products', product)
      if (response.status === 201) {
        for (const file of files) {
          const formData = new FormData()
          formData.append('image', file)
          await api.post(`/products/${response.data.data.id}/uploadimg`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        }
        await useProductosStore.getState().getProductos()
        set({ error: emptyError })
      }
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  modifyProduct: async (product, files, deletefiles) => {
    const { startLoading, finishLoading, closeModal } = useUIStore.getState()
    startLoading()
    try {
      const response = await api.put(`/products/${product.id}`, product)
      if (response.status === 200) {
        for (const df of deletefiles) {
          await api.post(`/products/${response.data.data.id}/deleteimg`, df)
        }
        for (const file of files) {
          const formData = new FormData()
          formData.append('image', file)
          await api.post(`/products/${response.data.data.id}/uploadimg`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        }
        await useProductosStore.getState().getProductos()
        set({ error: emptyError })
      }
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  deleteProduct: async (product) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/products/${product.id}`)
      await useProductosStore.getState().getProductos()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },

  restoreProduct: async (product) => {
    const { startLoading, finishLoading, closeDialog } = useUIStore.getState()
    startLoading()
    try {
      await api.post(`/products/${product.id}/restore`)
      await useProductosStore.getState().getProductos()
      set({ error: emptyError })
      closeDialog()
    } catch (error) {
      set({ error: errorResponse(error) })
    } finally {
      finishLoading()
    }
  },
}))
