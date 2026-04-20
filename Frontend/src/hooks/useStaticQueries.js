/**
 * Hooks de React Query para datos estáticos (categorías, marcas, sucursales).
 * Estos datos cambian poco y se consultan frecuentemente, por lo que el caché
 * de 5 minutos evita requests repetidos al navegar entre vistas.
 *
 * Uso:
 *   const { data: categorias, isLoading } = useCategorias()
 *   const { data: marcasCombo } = useMarcasCombo()
 */
import { useQuery } from '@tanstack/react-query'
import api from '../helpers/axiosInstance'

export const useCategorias = () =>
  useQuery({
    queryKey: ['categorias'],
    queryFn: () => api.get('/categories').then((r) => r.data.data),
  })

export const useCategoriasCombo = () =>
  useQuery({
    queryKey: ['categorias', 'combo'],
    queryFn: () => api.get('/categories/combo').then((r) => r.data.data),
  })

export const useMarcas = () =>
  useQuery({
    queryKey: ['marcas'],
    queryFn: () => api.get('/brands').then((r) => r.data.data),
  })

export const useMarcasCombo = () =>
  useQuery({
    queryKey: ['marcas', 'combo'],
    queryFn: () => api.get('/brands/combo').then((r) => r.data.data),
  })

export const useSucursales = () =>
  useQuery({
    queryKey: ['sucursales'],
    queryFn: () => api.get('/branches').then((r) => r.data.data),
  })

export const useSucursalesCombo = () =>
  useQuery({
    queryKey: ['sucursales', 'combo'],
    queryFn: () => api.get('/branches/combo').then((r) => r.data.data),
  })
