import React, { memo } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CTooltip,
  CButtonGroup,
  CBadge,
} from '@coreui/react'
import { ReceiptText, Trash, EllipsisVertical, X, ShoppingCart, File, QrCode, Banknote } from 'lucide-react'

export const SaleDetailPanel = memo(({
  doc_date,
  errDocDate,
  lineas,
  invoice,
  stockControlActivo,
  tipo_pago,
  handleStateChange,
  handleLineasChangeCantidad,
  handleLineasChangePrecio,
  handleClickRemove,
  resetForm,
  Vender,
  TotalDocumento,
}) => {
  return (
    <CCard className="p-0" style={{ minHeight: '700px', position: 'relative' }}>
      <CCardBody className="d-flex flex-column p-2">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <ShoppingCart size={16} className="text-primary" />
            <span className="fw-semibold">Carrito</span>
            {lineas.length > 0 && (
              <CBadge color="primary" shape="rounded-pill">{lineas.length}</CBadge>
            )}
            {invoice && (
              <CTooltip content="Venta Con Factura" placement="top">
                <ReceiptText size={16} className="text-primary" />
              </CTooltip>
            )}
          </div>
          <CDropdown variant="btn-group">
            <CDropdownToggle color="secondary" variant="ghost" size="sm" caret={false}>
              <EllipsisVertical size={16} />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={resetForm} className="text-danger cursor-pointer">
                <X size={14} /> Borrar formulario
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div>

        {/* Fecha */}
        <CFormInput
          type="date"
          name="doc_date"
          size="sm"
          value={doc_date || ''}
          onChange={handleStateChange}
          invalid={errDocDate}
          feedbackInvalid="este campo no puede estar vacío"
          className="mb-2"
        />

        {/* Líneas de detalle */}
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
          {lineas.length === 0 ? (
            <div className="text-center text-muted py-4" style={{ fontSize: '0.82rem' }}>
              <ShoppingCart size={28} className="mb-2 opacity-30" />
              <p className="mb-0">Agrega productos al carrito</p>
            </div>
          ) : lineas.map((item, x) => (
            <div
              key={x}
              className="mb-2 pb-2 border-bottom"
            >
              {/* Nombre + eliminar */}
              <div className="d-flex justify-content-between align-items-start gap-1 mb-1">
                <span className="small fw-semibold lh-sm" style={{ fontSize: '0.78rem' }}>
                  <span className="text-primary">{item.product.code}</span>
                  {' — '}{item.product.name}
                </span>
                <CButton
                  size="sm"
                  color="danger"
                  variant="ghost"
                  className="p-0 flex-shrink-0"
                  style={{ lineHeight: 1 }}
                  onClick={() => handleClickRemove(x)}
                >
                  <Trash size={14} />
                </CButton>
              </div>

              {/* Qty + Precio + Subtotal */}
              <div className="d-flex align-items-center gap-1">
                <CInputGroup size="sm" style={{ flex: '0 0 90px' }}>
                  <CInputGroupText className="px-1">
                    <ShoppingCart size={12} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    name={`q${x}`}
                    min={0}
                    max={stockControlActivo ? item.maxQuantity : undefined}
                    value={item.quantity}
                    invalid={item.errorQuantity}
                    onChange={handleLineasChangeCantidad}
                    className="text-end px-1"
                  />
                </CInputGroup>
                <CInputGroup size="sm" style={{ flex: '0 0 100px' }}>
                  <CInputGroupText className="px-1" style={{ fontSize: '0.72rem' }}>Bs</CInputGroupText>
                  <CFormInput
                    type="number"
                    name={`p${x}`}
                    min={item.minPrice}
                    value={item.price}
                    invalid={item.errorPrice}
                    onChange={handleLineasChangePrecio}
                    className="text-end px-1"
                  />
                </CInputGroup>
                <div className="ms-auto text-end fw-bold" style={{ fontSize: '0.82rem', minWidth: '70px' }}>
                  Bs {Number(item.total).toFixed(2)}
                </div>
              </div>

              {/* Errores */}
              {(item.errorPrice || item.errorQuantity) && (
                <div className="text-danger" style={{ fontSize: '0.70rem' }}>
                  {item.errorPrice && `Precio mín: Bs ${item.minPrice}  `}
                  {item.errorQuantity && 'Cantidad incorrecta'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer fijo */}
        <div className="mt-auto pt-2 border-top">
          {/* Tipo de pago */}
          <CButtonGroup role="group" className="w-100 mb-2">
            <CButton
              color={tipo_pago === 'EFECTIVO' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => handleStateChange({ target: { name: 'tipo_pago', value: 'EFECTIVO' } })}
            >
              <Banknote size={14} /> Efectivo
            </CButton>
            <CButton
              color={tipo_pago === 'QR' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => handleStateChange({ target: { name: 'tipo_pago', value: 'QR' } })}
            >
              <QrCode size={14} /> QR
            </CButton>
          </CButtonGroup>

          {/* Total */}
          <div className="d-flex justify-content-between align-items-center px-2 py-2 rounded mb-2"
            style={{ background: 'var(--cui-tertiary-bg)' }}>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Total a Pagar</span>
            <span className="fw-bold" style={{ fontSize: '1.25rem' }}>
              Bs {TotalDocumento(lineas).toFixed(2)}
            </span>
          </div>

          {/* Botón vender */}
          <CButtonGroup role="group" className="w-100">
            <CButton
              color="primary"
              size="lg"
              disabled={lineas.length === 0}
              onClick={Vender}
              style={{ flex: 1 }}
            >
              Realizar Venta
            </CButton>
            <CDropdown variant="btn-group">
              <CDropdownToggle color="primary">&nbsp;</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="#" className="text-info" onClick={(e) => {
                  e.preventDefault()
                  alert('Próximamente podrás generar una cotización en PDF para enviar a tus clientes.')
                }}>
                  <File size={14} /> Realizar Cotización
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CButtonGroup>
        </div>

      </CCardBody>
    </CCard>
  )
})

SaleDetailPanel.displayName = 'SaleDetailPanel'
