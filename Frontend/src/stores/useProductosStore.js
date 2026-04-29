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

const buildBusquedaURL = (data, page) => {
  const qs = new URLSearchParams({ q: data.buscar || '', b: data.sucursal, page })
  if (data.brand)    qs.set('brand',    data.brand)
  if (data.category) qs.set('category', data.category)
  if (data.sort && data.sort !== 'name_asc') qs.set('sort', data.sort)
  return `/products?${qs.toString()}`
}

export const useProductosStore = create((set) => ({
  productos: [],
  productosCombo: [],
  productosEtiqueta: [],
  paginaActual: 1,
  ultimaPagina: 1,
  totalProductos: 0,
  loadingMore: false,
  producto: emptyProducto,
  error: emptyError,

  getProductos: async (type = '', data = {}, page = 1, limit = 5) => {
    let URI = ''
    switch (type) {
      case 'combo':           URI = '/products/combo'; break
      case 'busqueda':        URI = buildBusquedaURL(data, page); break
      case 'busqueda-append': URI = buildBusquedaURL(data, page); break
      case 'etiquetas':       URI = '/products/etiquetas'; break
      default:
        URI = `/products/lista?page=${page}&limit=${limit}`
        if (data.search)  URI += `&search=${encodeURIComponent(data.search)}`
        if (data.trashed) URI += `&trashed=1`
        break
    }
    const { startLoading, finishLoading } = useUIStore.getState()
    const isAppend = type === 'busqueda-append'

    if (isAppend) {
      set({ loadingMore: true })
    } else {
      startLoading()
    }

    try {
      const response = await api.get(URI)
      switch (type) {
        case 'combo':
          set({ productosCombo: response.data.data }); break
        case 'busqueda':
          set({
            productos: response.data.data,
            paginaActual: response.data.current_page,
            ultimaPagina: response.data.last_page,
            totalProductos: response.data.total,
          }); break
        case 'busqueda-append':
          set((state) => ({
            productos: [...state.productos, ...response.data.data],
            paginaActual: response.data.current_page,
            ultimaPagina: response.data.last_page,
            totalProductos: response.data.total,
          })); break
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
      if (isAppend) {
        set({ loadingMore: false })
      } else {
        finishLoading()
      }
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
    const { startLoading, finishLoading, closeModal, addToast } = useUIStore.getState()
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
        addToast('success', 'Producto creado correctamente')
      }
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al crear el producto')
    } finally {
      finishLoading()
    }
  },

  modifyProduct: async (product, files, deletefiles) => {
    const { startLoading, finishLoading, closeModal, addToast } = useUIStore.getState()
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
        addToast('success', 'Producto actualizado correctamente')
      }
      closeModal()
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al actualizar el producto')
    } finally {
      finishLoading()
    }
  },

  deleteProduct: async (product) => {
    const { startLoading, finishLoading, closeDialog, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.delete(`/products/${product.id}`)
      await useProductosStore.getState().getProductos()
      set({ error: emptyError })
      closeDialog()
      addToast('success', 'Producto eliminado')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al eliminar el producto')
    } finally {
      finishLoading()
    }
  },

  restoreProduct: async (product) => {
    const { startLoading, finishLoading, closeDialog, addToast } = useUIStore.getState()
    startLoading()
    try {
      await api.post(`/products/${product.id}/restore`)
      await useProductosStore.getState().getProductos()
      set({ error: emptyError })
      closeDialog()
      addToast('success', 'Producto restaurado')
    } catch (error) {
      set({ error: errorResponse(error) })
      addToast('danger', 'Error al restaurar el producto')
    } finally {
      finishLoading()
    }
  },
}))
