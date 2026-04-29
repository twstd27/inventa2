import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'
import { useColorModes } from '@coreui/react'
import { useLayoutStore } from '../stores/useLayoutStore'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse" />
  </div>
)

const DefaultLayout = React.lazy(() => import('../layout/DefaultLayout'))
const Login = React.lazy(() => import('../views/pages/login/Login'))
const Page404 = React.lazy(() => import('../views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('../views/pages/page500/Page500'))
const ImpCotizacion = React.lazy(() => import('../views/pages/print/cotizacion'))
const CatalogoHome = React.lazy(() => import('../views/catalogo/CatalogoHome'))
const CatalogoCategoria = React.lazy(() => import('../views/catalogo/CatalogoCategoria'))

export const AppRouter = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const theme = useLayoutStore((s) => s.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const themeParam = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (themeParam) {
      setColorMode(themeParam)
    }
    if (isColorModeSet()) return
    setColorMode(theme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route exact path="/impresion/cotizacion" name="cotizacion" element={<ImpCotizacion />} />
          <Route exact path="/catalogo" element={<CatalogoHome />} />
          <Route exact path="/catalogo/:slug" element={<CatalogoCategoria />} />
          <Route element={<PrivateRoutes />}>
            <Route path="*" element={<DefaultLayout />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default AppRouter
