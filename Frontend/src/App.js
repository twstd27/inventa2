import React from 'react'
import './scss/style.scss'
import AppRouter from './routers/AppRouter'
import { setDefaultOptions } from 'date-fns'
import { es } from 'date-fns/locale'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

setDefaultOptions({ locale: es })

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutos — datos estáticos como categorías/marcas
      gcTime: 10 * 60 * 1000,      // 10 minutos en caché
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  )
}

export default App
