import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer } from '@coreui/react'

// routes config
import routes from '../routes'
import { PrivateRoutes } from '../routers/PrivateRoutes'
import SkeletonTable from './SkeletonLoader'

const publicRoutes = routes.filter((r) => !r.allowedRoles)
const adminRoutes = routes.filter((r) => r.allowedRoles?.includes(1))

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<SkeletonTable rows={6} cols={4} />}>
        <Routes>
          {publicRoutes.map((route, idx) =>
            route.element ? (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                element={<route.element />}
              />
            ) : null,
          )}
          <Route element={<PrivateRoutes allowedRoles={[1]} />}>
            {adminRoutes.map((route, idx) =>
              route.element ? (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              ) : null,
            )}
          </Route>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
