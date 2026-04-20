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
    <CCard className="p-0" style={{ height: '700px', position: 'relative' }}>
      <CCardBody className="d-flex flex-column">
        <CRow>
          <CCol xs="12" className="d-flex justify-content-between align-items-center">
            <div className="card-header-actions text-start">
              <span>
                <b>Detalle de venta</b>{' '}
                <CTooltip content="Venta Con Factura" placement="top">
                  <ReceiptText
                    size={24}
                    className={`${invoice ? 'text-primary' : 'display-none'}`}
                  />
                </CTooltip>
              </span>
            </div>
            <div className="card-header-actions text-end">
              <CDropdown variant="btn-group">
                <CDropdownToggle color="primary" caret>
                  <EllipsisVertical size={16} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={resetForm} className="text-danger cursor-pointer">
                    <X size={16} /> Borrar Formulario
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </CCol>
          <CCol xs="12">
            <CFormInput
              type="date"
              name="doc_date"
              plainText
              value={doc_date || ''}
              onChange={handleStateChange}
              invalid={errDocDate}
              feedbackInvalid="este campo no puede estar vacío"
            />
          </CCol>
          <CCol xs="12" className="mt-2" style={{ height: '400px', overflow: 'auto' }}>
            {lineas.map((item, x) => (
              <CCard
                className="mb-2"
                style={{ borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
                key={x}
              >
                <CRow className="g-0">
                  <CCol md={11}>
                    <span className="d-flex vertical-align-middle small">
                      {item.product.code + ' - ' + item.product.name}
                    </span>
                  </CCol>
                  <CCol md={1} className="text-center">
                    <CButton
                      size="sm"
                      color="danger"
                      variant="ghost"
                      onClick={() => handleClickRemove(x)}
                    >
                      <Trash size={16} />
                    </CButton>
                  </CCol>
                  <CCol md={12}>
                    <CRow className="g-0">
                      <CCol
                        md={12}
                        className="d-flex justify-content-around align-items-center mb-1"
                      >
                        <CInputGroup className="m-1">
                          <CInputGroupText as="label" htmlFor={`q${x}`}>
                            <ShoppingCart size={16} />
                          </CInputGroupText>
                          <CFormInput
                            size="sm"
                            className="text-right"
                            style={{ height: '38px' }}
                            type="number"
                            name={`q${x}`}
                            min={0}
                            max={stockControlActivo ? item.maxQuantity : undefined}
                            value={item.quantity}
                            invalid={item.errorQuantity}
                            valid={!item.errorQuantity}
                            onChange={handleLineasChangeCantidad}
                          />
                        </CInputGroup>
                        <CInputGroup className="m-1">
                          <CInputGroupText as="label" htmlFor={`p${x}`}>Bs</CInputGroupText>
                          <CFormInput
                            size="sm"
                            className="text-right"
                            type="number"
                            name={`p${x}`}
                            min={item.minPrice}
                            value={item.price}
                            invalid={item.errorPrice}
                            valid={!item.errorPrice}
                            onChange={handleLineasChangePrecio}
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={12}>
                    <span className="d-flex justify-content-end small text-danger">
                      {item.errorPrice && `(El precio debe ser mayor a ${item.minPrice})`}
                      {item.errorQuantity && `(Cantidad incorrecta)`}
                    </span>
                  </CCol>
                </CRow>
              </CCard>
            ))}
          </CCol>
        </CRow>

        <div className="mt-auto">
          <CCol xs="12" className="mt-2">
            <CButtonGroup role="group" className="w-100">
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
          </CCol>
          <CCol xs="12" className="mt-2">
            <CCard className="p-0">
              <CCardBody>
                <CRow>
                  <CCol xs="12" className="d-flex justify-content-between align-items-center">
                    Total a Pagar:{' '}
                    <span>
                      Bs{' '}
                      <span className="text-2xl">
                        <b>{TotalDocumento(lineas).toFixed(2)}</b>
                      </span>
                    </span>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs="12" className="mt-2">
            <div className="d-grid gap-2">
              <CButtonGroup role="group" aria-label="Button group with nested dropdown">
                <CButton
                  color="primary"
                  size="lg"
                  disabled={lineas.length === 0}
                  onClick={Vender}
                >
                  Realizar Venta
                </CButton>
                <CDropdown variant="btn-group">
                  <CDropdownToggle color="primary"> </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem href="#" className="text-info">
                      <File size={16} /> Realizar Cotización
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CButtonGroup>
            </div>
          </CCol>
        </div>
      </CCardBody>
    </CCard>
  )
})

SaleDetailPanel.displayName = 'SaleDetailPanel'
