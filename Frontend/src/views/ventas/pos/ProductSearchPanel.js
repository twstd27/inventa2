import React, { memo, useRef, useCallback } from 'react'
import {
  CCol, CRow, CFormInput, CInputGroup, CInputGroupText,
  CBadge, CButton, CFormSelect,
} from '@coreui/react'
import Select from 'react-select'
import { Search, SlidersHorizontal, PackageCheck, X } from 'lucide-react'
import { CardProducto } from '../../productos/CardProducto'

export const ProductSearchPanel = memo(({
  sucursalVenta,
  sucursalesCombo,
  errBranch,
  buscar,
  lineas,
  loading,
  productos,
  totalProductos,
  selectStyles,
  handleSelectChangeBranch,
  handleStateChange,
  handleKeyUp,
  handleClickAdd,
  openModalProducto,
  handleScrollEnd,
  loadingMore,
  redondeo,
  marcasCombo,
  categoriasCombo,
  filtro_marca,
  filtro_categoria,
  filtro_sort,
  filtro_stock,
  hayFiltrosActivos,
  handleFiltroMarca,
  handleFiltroCategoria,
  handleFiltroSort,
  handleFiltroStock,
  limpiarFiltros,
}) => {
  const scrollRef = useRef(null)

  const handleScroll = useCallback(() => {
    if (loadingMore) return
    const el = scrollRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) handleScrollEnd()
  }, [handleScrollEnd, loadingMore])

  return (
    <div className="d-flex flex-column gap-2">

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary" />
          <span className="fw-semibold">Buscar Productos</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          {totalProductos > 0 && (
            <CBadge color="primary" className="px-2">
              {totalProductos} resultados
            </CBadge>
          )}
          {hayFiltrosActivos && (
            <CButton size="sm" color="danger" variant="ghost" onClick={limpiarFiltros} title="Limpiar filtros">
              <X size={14} /> Limpiar
            </CButton>
          )}
        </div>
      </div>

      {/* Fila 1: Sucursal + Búsqueda */}
      <CRow className="g-2">
        <CCol xs="12" md="5">
          <Select
            value={sucursalVenta}
            onChange={handleSelectChangeBranch}
            options={sucursalesCombo}
            isDisabled={lineas.length > 0}
            placeholder="Sucursal..."
            name="branch"
            styles={selectStyles}
          />
          {errBranch && <span className="text-danger" style={{ fontSize: '0.75rem' }}>{errBranch}</span>}
        </CCol>
        <CCol xs="12" md="7">
          <CInputGroup>
            <CInputGroupText><Search size={15} /></CInputGroupText>
            <CFormInput
              name="buscar"
              value={buscar}
              onChange={handleStateChange}
              onKeyUp={handleKeyUp}
              placeholder="Nombre o código de producto..."
            />
          </CInputGroup>
        </CCol>
      </CRow>

      {/* Fila 2: Filtros */}
      <CRow className="g-2 align-items-center">
        <CCol xs="6" md="4">
          <Select
            value={filtro_marca}
            onChange={handleFiltroMarca}
            options={marcasCombo}
            isClearable
            placeholder="Marca..."
            styles={selectStyles}
          />
        </CCol>
        <CCol xs="6" md="4">
          <Select
            value={filtro_categoria}
            onChange={handleFiltroCategoria}
            options={categoriasCombo}
            isClearable
            placeholder="Categoría..."
            styles={selectStyles}
          />
        </CCol>
        <CCol xs="8" md="3">
          <CFormSelect
            size="sm"
            value={filtro_sort}
            onChange={handleFiltroSort}
          >
            <option value="name_asc">A → Z</option>
            <option value="name_desc">Z → A</option>
          </CFormSelect>
        </CCol>
        <CCol xs="4" md="1" className="d-flex justify-content-center">
          <CButton
            size="sm"
            color={filtro_stock ? 'success' : 'outline-secondary'}
            onClick={handleFiltroStock}
            title="Solo con stock disponible"
            className="w-100"
          >
            <PackageCheck size={15} />
          </CButton>
        </CCol>
      </CRow>

      {/* Sucursal info */}
      {sucursalVenta && (
        <div className="text-primary" style={{ fontSize: '0.75rem' }}>
          Sucursal: <b>{sucursalVenta.label}</b>
          {filtro_stock && <CBadge color="success" className="ms-2">Con stock</CBadge>}
        </div>
      )}

      {/* Grid de productos */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ height: '590px', overflowY: 'auto', overflowX: 'hidden' }}
      >
        {sucursalVenta === null ? (
          <div className="text-center text-muted py-5">
            <SlidersHorizontal size={32} className="mb-2 opacity-50" />
            <p className="mb-0">Selecciona una sucursal para buscar productos</p>
          </div>
        ) : loading ? (
          <div className="text-center py-4">
            <i className="fa fa-spinner fa-spin" /> Buscando...
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p className="mb-0">No se encontraron resultados</p>
          </div>
        ) : (
          <>
            <CRow className="g-0">
              {productos.map((item, x) => (
                <CardProducto
                  producto={item}
                  agregar={() => handleClickAdd(item)}
                  modal={() => openModalProducto(item)}
                  redondeo={redondeo}
                  key={x}
                />
              ))}
            </CRow>
            {loadingMore && (
              <div className="text-center py-2 text-muted" style={{ fontSize: '0.8rem' }}>
                <i className="fa fa-spinner fa-spin" /> Cargando más...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
})

ProductSearchPanel.displayName = 'ProductSearchPanel'
