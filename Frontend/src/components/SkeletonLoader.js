import React from 'react'
import { CCol, CRow, CCard, CCardBody } from '@coreui/react'

const pulse = {
  background: 'linear-gradient(90deg, var(--cui-tertiary-bg) 25%, var(--cui-secondary-bg) 50%, var(--cui-tertiary-bg) 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-pulse 1.4s ease-in-out infinite',
  borderRadius: '4px',
}

const styles = `
@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`

const Bar = ({ width = '100%', height = '16px', style = {} }) => (
  <div style={{ ...pulse, width, height, marginBottom: '8px', ...style }} />
)

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <>
    <style>{styles}</style>
    <CCard className="mb-4">
      <CCardBody>
        <Bar width="200px" height="24px" style={{ marginBottom: '16px' }} />
        <Bar width="100%" height="38px" style={{ marginBottom: '16px' }} />
        {Array.from({ length: rows }).map((_, r) => (
          <CRow key={r} className="mb-2 align-items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <CCol key={c}>
                <Bar height="14px" width={c === 0 ? '60%' : '80%'} style={{ marginBottom: 0 }} />
              </CCol>
            ))}
          </CRow>
        ))}
      </CCardBody>
    </CCard>
  </>
)

export const SkeletonCards = ({ count = 8 }) => (
  <>
    <style>{styles}</style>
    <CRow>
      {Array.from({ length: count }).map((_, i) => (
        <CCol key={i} xs="6" lg="4" xl="3" className="p-1">
          <CCard className="mb-1">
            <div style={{ ...pulse, height: '120px', borderRadius: '4px 4px 0 0' }} />
            <CCardBody className="p-2">
              <Bar height="12px" width="60%" />
              <Bar height="12px" width="80%" />
              <div className="d-flex justify-content-between mt-2">
                <Bar height="20px" width="40%" style={{ marginBottom: 0 }} />
                <Bar height="32px" width="32px" style={{ borderRadius: '4px', marginBottom: 0 }} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  </>
)

export const SkeletonDashboard = () => (
  <>
    <style>{styles}</style>
    <CRow className="mb-4">
      {[1, 2, 3, 4].map((i) => (
        <CCol key={i} sm="6" xl="3" className="mb-4">
          <CCard>
            <CCardBody>
              <Bar height="14px" width="50%" />
              <Bar height="32px" width="70%" style={{ marginBottom: 0 }} />
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
    <CRow>
      <CCol lg="8">
        <CCard className="mb-4">
          <CCardBody>
            <Bar height="200px" style={{ borderRadius: '8px' }} />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg="4">
        <CCard className="mb-4">
          <CCardBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="d-flex justify-content-between mb-3">
                <Bar height="14px" width="60%" style={{ marginBottom: 0 }} />
                <Bar height="14px" width="25%" style={{ marginBottom: 0 }} />
              </div>
            ))}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </>
)

export default SkeletonTable
