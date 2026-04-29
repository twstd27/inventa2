import React from 'react'
import { CCard, CCardBody, CCol, CRow, CToaster } from '@coreui/react'
import { Dialog } from '../common/Dialog'
import { DialogVentas } from './DialogVentas'
import { ModalVentas } from './ModalVentas'
import { ModalDetalleProducto } from '../productos/ModalDetalleProducto'
import { ModalEtiqueta } from '../productos/ModalEtiqueta'
import { usePOSState } from './pos/usePOSState'
import { ProductSearchPanel } from './pos/ProductSearchPanel'
import { SaleDetailPanel } from './pos/SaleDetailPanel'

const POS = () => {
  const pos = usePOSState()

  return (
    <>
      <CToaster className="p-3" placement="bottom-end" push={pos.toast} ref={pos.toaster} />
      <CRow className="g-2">
        <CCol xs="12" xl="8">
          <CCard className="p-0 h-100">
            <CCardBody className="pb-2">
              <ProductSearchPanel
                sucursalVenta={pos.sucursalVenta}
                sucursalesCombo={pos.sucursalesCombo}
                errBranch={pos.errBranch}
                buscar={pos.buscar}
                lineas={pos.lineas}
                loading={pos.loading}
                productos={pos.productos}
                totalProductos={pos.totalProductos}
                selectStyles={pos.selectStyles}
                handleSelectChangeBranch={pos.handleSelectChangeBranch}
                handleStateChange={pos.handleStateChange}
                handleKeyUp={pos.handleKeyUp}
                handleClickAdd={pos.handleClickAdd}
                openModalProducto={pos.openModalProducto}
                handleScrollEnd={pos.handleScrollEnd}
                loadingMore={pos.loadingMore}
                redondeo={pos.redondeo}
                marcasCombo={pos.marcasCombo}
                categoriasCombo={pos.categoriasCombo}
                filtro_marca={pos.filtro_marca}
                filtro_categoria={pos.filtro_categoria}
                filtro_sort={pos.filtro_sort}
                filtro_stock={pos.filtro_stock}
                hayFiltrosActivos={pos.hayFiltrosActivos}
                handleFiltroMarca={pos.handleFiltroMarca}
                handleFiltroCategoria={pos.handleFiltroCategoria}
                handleFiltroSort={pos.handleFiltroSort}
                handleFiltroStock={pos.handleFiltroStock}
                limpiarFiltros={pos.limpiarFiltros}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs="12" xl="4">
          <SaleDetailPanel
            doc_date={pos.doc_date}
            errDocDate={pos.errDocDate}
            lineas={pos.lineas}
            invoice={pos.invoice}
            stockControlActivo={pos.stockControlActivo}
            tipo_pago={pos.tipo_pago}
            handleStateChange={pos.handleStateChange}
            handleLineasChangeCantidad={pos.handleLineasChangeCantidad}
            handleLineasChangePrecio={pos.handleLineasChangePrecio}
            handleClickRemove={pos.handleClickRemove}
            resetForm={pos.resetForm}
            Vender={pos.Vender}
            TotalDocumento={pos.TotalDocumento}
          />
        </CCol>
      </CRow>
      <Dialog />
      <ModalDetalleProducto action={pos.handleClickAdd} />
      <ModalEtiqueta />
      <DialogVentas f1={pos.RealizarVenta} />
      <ModalVentas />
    </>
  )
}

export default POS
