import React, { useEffect, useState, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CRow,
  CBadge,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilQrCode, cilArrowTop, cilArrowBottom, cilMinus } from '@coreui/icons'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { TrendingUp, TrendingDown, ShoppingCart, Package, DollarSign, BarChart2, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import api from '../../helpers/axiosInstance'
import { SkeletonDashboard } from '../../components/SkeletonLoader'

const KPICard = ({ title, value, subtitle, icon: Icon, color, trend, trendValue }) => (
  <CCard className="mb-4 border-0 shadow-sm">
    <CCardBody>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="text-body-secondary small text-uppercase fw-semibold mb-1">{title}</div>
          <div className="fs-4 fw-bold">{value}</div>
          {subtitle && <div className="text-body-secondary small mt-1">{subtitle}</div>}
        </div>
        <div className={`p-2 rounded bg-${color} bg-opacity-10`}>
          <Icon size={24} className={`text-${color}`} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-2 d-flex align-items-center gap-1">
          {trend > 0 ? (
            <CIcon icon={cilArrowTop} className="text-success" size="sm" />
          ) : trend < 0 ? (
            <CIcon icon={cilArrowBottom} className="text-danger" size="sm" />
          ) : (
            <CIcon icon={cilMinus} className="text-secondary" size="sm" />
          )}
          <span className={`small fw-semibold text-${trend > 0 ? 'success' : trend < 0 ? 'danger' : 'secondary'}`}>
            {Math.abs(trendValue)}% vs ayer
          </span>
        </div>
      )}
    </CCardBody>
  </CCard>
)

const Dashboard = () => {
  const navigate = useNavigate()
  const { usuario } = useAuthStore()
  const isAdmin = usuario?.role_id === 1
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [kpis, setKpis] = useState({
    ventasHoy: 0,
    ventasAyer: 0,
    ticketPromedio: 0,
    totalTransaccionesHoy: 0,
    topProductos: [],
    ventasPorDia: [],
  })

  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
  const sevenDaysAgo = format(subDays(new Date(), 6), 'yyyy-MM-dd')

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const [resHoy, resAyer, resSemana] = await Promise.all([
        api.get(`/sales/diario?start_date=${today}&end_date=${today}`).catch(() => ({ data: { data: [] } })),
        api.get(`/sales/diario?start_date=${yesterday}&end_date=${yesterday}`).catch(() => ({ data: { data: [] } })),
        api.get(`/sales/diario?start_date=${sevenDaysAgo}&end_date=${today}`).catch(() => ({ data: { data: [] } })),
      ])

      // Cada fila = 1 línea de detalle: { id (venta), doc_date "dd/MM/yyyy", name, quantity, price, cost, total, profit }
      const ventasHoyData = resHoy.data.data || []
      const ventasAyerData = resAyer.data.data || []
      const ventasSemanaData = resSemana.data.data || []

      // Total facturado = suma de la columna `total` (price * quantity por línea)
      const sumarTotal = (arr) => arr.reduce((acc, v) => acc + parseFloat(v.total || 0), 0)
      const ventasHoy = sumarTotal(ventasHoyData)
      const ventasAyer = sumarTotal(ventasAyerData)

      // Transacciones = ventas únicas (por id de venta, no por línea de detalle)
      const ventasUnicas = new Set(ventasHoyData.map((v) => v.id))
      const totalTransaccionesHoy = ventasUnicas.size
      const ticketPromedio = totalTransaccionesHoy > 0 ? ventasHoy / totalTransaccionesHoy : 0

      // Top productos del día — cada fila ya es un detalle con name + total
      const productMap = {}
      ventasHoyData.forEach((linea) => {
        const name = linea.name || `Producto ${linea.product_id}`
        if (!productMap[name]) productMap[name] = { name, cantidad: 0, total: 0 }
        productMap[name].cantidad += parseFloat(linea.quantity || 0)
        productMap[name].total += parseFloat(linea.total || 0)
      })
      const topProductos = Object.values(productMap)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)

      // Ventas por día (últimos 7 días)
      // doc_date viene como "dd/MM/yyyy" — convertir a "yyyy-MM-dd" para el mapa
      const diasMap = {}
      for (let i = 6; i >= 0; i--) {
        diasMap[format(subDays(new Date(), i), 'yyyy-MM-dd')] = 0
      }
      ventasSemanaData.forEach((v) => {
        // Parsear "dd/MM/yyyy" → Date → "yyyy-MM-dd"
        const parts = (v.doc_date || '').split('/')
        if (parts.length === 3) {
          const iso = `${parts[2]}-${parts[1]}-${parts[0]}`
          if (diasMap[iso] !== undefined) diasMap[iso] += parseFloat(v.total || 0)
        }
      })
      const ventasPorDia = Object.entries(diasMap).map(([fecha, total]) => ({
        fecha: format(new Date(fecha + 'T12:00:00'), 'dd/MM'),
        total,
      }))

      setKpis({
        ventasHoy,
        ventasAyer,
        ticketPromedio,
        totalTransaccionesHoy,
        topProductos,
        ventasPorDia,
      })
    } catch (err) {
      if (import.meta.env.DEV) console.error('[dashboard]', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [today, yesterday, sevenDaysAgo]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAdmin) loadDashboard()
    else setLoading(false)
  }, [loadDashboard, isAdmin])

  const tendencia = kpis.ventasAyer > 0
    ? Math.round(((kpis.ventasHoy - kpis.ventasAyer) / kpis.ventasAyer) * 100)
    : kpis.ventasHoy > 0 ? 100 : 0

  if (!isAdmin) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <CButton color="primary" size="lg" onClick={() => navigate('/qr-scanner')}>
          <CIcon icon={cilQrCode} className="me-2" style={{ fontSize: '1.5rem' }} />
          Escanear QR
        </CButton>
      </div>
    )
  }

  if (loading) return <SkeletonDashboard />

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold">Dashboard</h4>
        <div className="d-flex gap-2">
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
          >
            {refreshing ? <CSpinner size="sm" className="me-1" /> : <RefreshCw size={14} className="me-1" />}
            Actualizar
          </CButton>
          <CButton color="primary" variant="outline" size="sm" onClick={() => navigate('/qr-scanner')}>
            <CIcon icon={cilQrCode} className="me-1" /> Escanear
          </CButton>
        </div>
      </div>

      {/* KPI Cards */}
      <CRow>
        <CCol sm="6" xl="3">
          <KPICard
            title="Ventas Hoy"
            value={`Bs ${kpis.ventasHoy.toFixed(2)}`}
            subtitle={`Ayer: Bs ${kpis.ventasAyer.toFixed(2)}`}
            icon={DollarSign}
            color="primary"
            trend={tendencia}
            trendValue={Math.abs(tendencia)}
          />
        </CCol>
        <CCol sm="6" xl="3">
          <KPICard
            title="Transacciones Hoy"
            value={kpis.totalTransaccionesHoy}
            subtitle="Número de ventas"
            icon={ShoppingCart}
            color="success"
          />
        </CCol>
        <CCol sm="6" xl="3">
          <KPICard
            title="Ticket Promedio"
            value={`Bs ${kpis.ticketPromedio.toFixed(2)}`}
            subtitle="Promedio por venta"
            icon={BarChart2}
            color="warning"
          />
        </CCol>
        <CCol sm="6" xl="3">
          <KPICard
            title="Vs Ayer"
            value={`${tendencia > 0 ? '+' : ''}${tendencia}%`}
            subtitle={tendencia > 0 ? 'Por encima de ayer' : tendencia < 0 ? 'Por debajo de ayer' : 'Igual que ayer'}
            icon={tendencia >= 0 ? TrendingUp : TrendingDown}
            color={tendencia >= 0 ? 'success' : 'danger'}
          />
        </CCol>
      </CRow>

      <CRow>
        {/* Gráfico de ventas últimos 7 días */}
        <CCol lg="8">
          <CCard className="mb-4">
            <CCardHeader>
              <CCardTitle className="mb-0">Ventas — Últimos 7 días</CCardTitle>
            </CCardHeader>
            <CCardBody>
              {kpis.ventasPorDia.every((d) => d.total === 0) ? (
                <div className="text-center py-4 text-body-secondary">
                  <Package size={40} className="mb-2 opacity-50" />
                  <p>Sin datos de ventas en los últimos 7 días</p>
                </div>
              ) : (
                <CChartBar
                  data={{
                    labels: kpis.ventasPorDia.map((d) => d.fecha),
                    datasets: [
                      {
                        label: 'Ventas (Bs)',
                        backgroundColor: 'rgba(50, 115, 220, 0.6)',
                        borderColor: 'rgba(50, 115, 220, 1)',
                        borderWidth: 1,
                        data: kpis.ventasPorDia.map((d) => d.total.toFixed(2)),
                      },
                    ],
                  }}
                  options={{
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true, ticks: { callback: (v) => `Bs ${v}` } },
                    },
                    responsive: true,
                    maintainAspectRatio: true,
                  }}
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Top productos del día */}
        <CCol lg="4">
          <CCard className="mb-4">
            <CCardHeader>
              <CCardTitle className="mb-0">Top Productos Hoy</CCardTitle>
            </CCardHeader>
            <CCardBody className="p-0">
              {kpis.topProductos.length === 0 ? (
                <div className="text-center py-4 text-body-secondary">
                  <Package size={36} className="mb-2 opacity-50" />
                  <p className="small">Sin ventas hoy</p>
                </div>
              ) : (
                <CTable small borderless className="mb-0">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-body-secondary small">#</CTableHeaderCell>
                      <CTableHeaderCell className="text-body-secondary small">Producto</CTableHeaderCell>
                      <CTableHeaderCell className="text-body-secondary small text-end">Total</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {kpis.topProductos.map((p, i) => (
                      <CTableRow key={i}>
                        <CTableDataCell>
                          <CBadge color={i === 0 ? 'warning' : i === 1 ? 'secondary' : 'light'} textColor={i >= 2 ? 'dark' : undefined}>
                            {i + 1}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="small">{p.name}</CTableDataCell>
                        <CTableDataCell className="small text-end fw-semibold">
                          Bs {p.total.toFixed(2)}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
