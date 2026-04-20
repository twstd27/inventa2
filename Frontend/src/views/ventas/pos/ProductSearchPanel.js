import React, { memo, useRef, useCallback } from 'react'
import { CCol, CRow, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import Select from 'react-select'
import { Search } from 'lucide-react'
import { CardProducto } from '../../productos/CardProducto'

export const ProductSearchPanel = memo(({
  sucursalVenta,
  sucursalesCombo,
  errBranch,
  buscar,
  lineas,
  loading,
  productos,
  selectStyles,
  handleSelectChangeBranch,
  handleStateChange,
  handleKeyUp,
  handleClickAdd,
  openModalProducto,
  handleScrollEnd,
  loadingMore,
}) => { // eslint-disable-line
  const scrollRef = useRef(null)

  const handleScroll = useCallback(() => {
    if (loadingMore) return
    const el = scrollRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      handleScrollEnd()
    }
  }, [handleScrollEnd, loadingMore])

  return (
    <CRow>
      <CCol xs="6">
        <Select
          value={sucursalVenta}
          onChange={handleSelectChangeBranch}
          options={sucursalesCombo}
          isDisabled={lineas.length > 0}
          placeholder="Seleccione una sucursal..."
          name="branch"
          styles={selectStyles}
          className="w-100"
        />
        <span className="text-danger small">{errBranch}</span>
      </CCol>
      <CCol xs="6">
        <CInputGroup>
          <CInputGroupText>
            <Search size={16} />
          </CInputGroupText>
          <CFormInput
            name="buscar"
            value={buscar}
            onChange={handleStateChange}
            onKeyUp={handleKeyUp}
            placeholder="Nombre o Código de Producto"
          />
        </CInputGroup>
      </CCol>
      <CCol xs="12" className="mt-2" style={{ height: '650px', overflow: 'auto' }} ref={scrollRef} onScroll={handleScroll}>
        {sucursalVenta === null ? (
          <span className="text-danger small">debe elegir una sucursal</span>
        ) : (
          <span className="text-primary small">
            Buscando productos en sucursal: <b>{sucursalVenta.label}</b>
          </span>
        )}
        {loading ? (
          <span>
            <i className="fa fa-spinner fa-spin" /> buscando..
          </span>
        ) : productos.length === 0 ? (
          <h6>No se encontraron resultados</h6>
        ) : (
          <>
            <CRow>
              {productos.map((item, x) => (
                <CardProducto
                  producto={item}
                  agregar={() => handleClickAdd(item)}
                  modal={() => openModalProducto(item)}
                  key={x}
                />
              ))}
            </CRow>
            {loadingMore && (
              <div className="text-center py-2">
                <i className="fa fa-spinner fa-spin" /> cargando más...
              </div>
            )}
          </>
        )}
      </CCol>
    </CRow>
  )
})

ProductSearchPanel.displayName = 'ProductSearchPanel'
