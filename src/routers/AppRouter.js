import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PrivateRoutes } from './PrivateRoutes'
import { useColorModes } from '@coreui/react'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse" />
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('../layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('../views/pages/login/Login'))
const Register = React.lazy(() => import('../views/pages/register/Register'))
const Page404 = React.lazy(() => import('../views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('../views/pages/page500/Page500'))
const ImpCotizacion = React.lazy(() => import('../views/pages/print/cotizacion'))

export const AppRouter = () => {
  const dispatch = useDispatch()

  const { logged } = useSelector((state) => state.auth)
  // const [isLoggedIn, setIsLoggedIn] = useState(logged)

  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {}, [dispatch])

  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route exact path="/impresion/cotizacion" name="cotizacion" element={<ImpCotizacion />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
          <Route
            path="/impresion/cotizacion"
            name="cotizacion"
            render={(props) => <ImpCotizacion {...props} />}
          />

          <Route element={<PrivateRoutes isLogged={logged} />}>
            <Route path="/" element={<DefaultLayout />} />
            {/* Otras rutas privadas pueden ir aquí */}
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default AppRouter
