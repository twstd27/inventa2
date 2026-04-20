import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CRow,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CSpinner,
} from '@coreui/react'
import { Search, ShieldAlert } from 'lucide-react'
import { format } from 'date-fns'
import { useAuditStore } from '../../stores/useAuditStore'
import { useUIStore } from '../../stores/useUIStore'

const ACTION_COLORS = {
  created: 'success',
  updated: 'warning',
  deleted: 'danger',
  restored: 'info',
  hard_deleted: 'dark',
  login: 'primary',
}

const ACTION_LABELS = {
  created: 'Creado',
  updated: 'Editado',
  deleted: 'Eliminado',
  restored: 'Restaurado',
  hard_deleted: 'Borrado def.',
  login: 'Login',
}

const LogDeActividad = () => {
  const { logs, paginaActual, ultimaPagina, total, getLogs } = useAuditStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const debounceTimer = useRef(null)

  const today = format(new Date(), 'yyyy-MM-dd')
  const [filters, setFilters] = useState({
    action: '',
    model: '',
    start_date: today,
    end_date: today,
  })
  const [page, setPage] = useState(1)

  const fetchLogs = useCallback(
    (f = filters, p = page) => {
      const clean = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''))
      getLogs(clean, p)
    },
    [filters, page, getLogs],
  )

  useEffect(() => {
    fetchLogs()
  }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = ({ target }) => {
    const next = { ...filters, [target.name]: target.value }
    setFilters(next)
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setPage(1)
      const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v !== ''))
      getLogs(clean, 1)
    }, 400)
  }

  const models = [...new Set(logs.map((l) => l.model).filter(Boolean))]

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="d-flex align-items-center gap-2">
            <ShieldAlert size={20} />
            <CCardTitle className="mb-0">Log de Actividad</CCardTitle>
            <span className="ms-auto text-body-secondary small">{total} registros</span>
          </CCardHeader>
          <CCardBody>
            {/* Filtros */}
            <CRow className="mb-3 g-2">
              <CCol xs="6" md="3">
                <CFormSelect
                  size="sm"
                  name="action"
                  value={filters.action}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas las acciones</option>
                  {Object.entries(ACTION_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs="6" md="3">
                <CFormSelect
                  size="sm"
                  name="model"
                  value={filters.model}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los modelos</option>
                  {models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs="6" md="3">
                <CFormInput
                  type="date"
                  size="sm"
                  name="start_date"
                  value={filters.start_date}
                  onChange={handleFilterChange}
                />
              </CCol>
              <CCol xs="6" md="3">
                <CFormInput
                  type="date"
                  size="sm"
                  name="end_date"
                  value={filters.end_date}
                  onChange={handleFilterChange}
                />
              </CCol>
            </CRow>

            {loading ? (
              <div className="text-center py-4">
                <CSpinner color="primary" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-4 text-body-secondary">
                <ShieldAlert size={40} className="mb-2 opacity-40" />
                <p>No hay registros para los filtros seleccionados</p>
              </div>
            ) : (
              <>
                <CTable small hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Fecha</CTableHeaderCell>
                      <CTableHeaderCell>Usuario</CTableHeaderCell>
                      <CTableHeaderCell>Acción</CTableHeaderCell>
                      <CTableHeaderCell>Módulo</CTableHeaderCell>
                      <CTableHeaderCell>Registro</CTableHeaderCell>
                      <CTableHeaderCell>Cambios</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {logs.map((log) => (
                      <CTableRow key={log.id}>
                        <CTableDataCell className="text-nowrap small">
                          {log.created_at
                            ? format(new Date(log.created_at), 'dd/MM/yy HH:mm')
                            : '-'}
                        </CTableDataCell>
                        <CTableDataCell className="small">
                          {log.user
                            ? `${log.user.name} ${log.user.lastname}`
                            : <span className="text-body-secondary">Sistema</span>}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={ACTION_COLORS[log.action] || 'secondary'}>
                            {ACTION_LABELS[log.action] || log.action}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="small">{log.model || '-'}</CTableDataCell>
                        <CTableDataCell className="small">
                          {log.model_label || log.model_id || '-'}
                        </CTableDataCell>
                        <CTableDataCell className="small">
                          {log.changes ? (
                            <details>
                              <summary className="cursor-pointer text-primary small">Ver cambios</summary>
                              <pre className="mt-1 small text-body-secondary" style={{ fontSize: '11px', maxWidth: '300px', overflowX: 'auto' }}>
                                {JSON.stringify(log.changes, null, 2)}
                              </pre>
                            </details>
                          ) : '-'}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                {ultimaPagina > 1 && (
                  <CPagination className="mt-3" size="sm">
                    <CPaginationItem disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                      Ant
                    </CPaginationItem>
                    <CPaginationItem disabled>
                      {page} / {ultimaPagina}
                    </CPaginationItem>
                    <CPaginationItem disabled={page >= ultimaPagina} onClick={() => setPage((p) => p + 1)}>
                      Sig
                    </CPaginationItem>
                  </CPagination>
                )}
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default LogDeActividad
