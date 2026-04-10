import React from 'react'
import './scss/style.scss'
import AppRouter from './routers/AppRouter'
import { setDefaultOptions } from 'date-fns'
import { es } from 'date-fns/locale'
setDefaultOptions({ locale: es })

const App = () => {
  return <AppRouter />
}

export default App
