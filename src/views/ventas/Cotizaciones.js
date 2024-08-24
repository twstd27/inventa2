import React, {useEffect, useState} from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CDataTable,
  CInput,
  CInputGroupPrepend,
  CInputGroup,
  CFormGroup,
  CInputGroupText,
  CLabel,
  CInvalidFeedback,
  CTextarea,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CDropdown, CTabs, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CLink, CListGroup, CListGroupItem, CTooltip
} from '@coreui/react'
import CIcon from "@coreui/icons-react";
import {useDispatch, useSelector} from "react-redux";
import {getProductos, resetProductosLista, setProducto} from "../../actions/productosAction";
import Select from "react-select";
import {getSucursales} from "../../actions/sucursalesAction";
import {Dialog} from "../common/Dialog";
import {
  uiCloseModal,
  uiOpenCotizacionesDialog,
  uiOpenCotizacionesModal,
  uiOpenDialog,
  uiOpenModal
} from "../../actions/uiAction";
import moment from "moment";
import {ModalCotizaciones} from "./ModalCotizaciones";
import {CardProducto} from "../productos/CardProducto";
import {ModalDetalleProducto} from "../productos/ModalDetalleProducto";
import {getCotizaciones, registerQuotation, setCotizacion} from "../../actions/cotizacionesAction";
import {DialogCotizaciones} from "./DialogCotizaciones";

const POS = () => {
  const {usuario} = useSelector(state => state.auth);
  const {productos} = useSelector(state => state.productos);
  const {cotizaciones} = useSelector(state => state.cotizaciones);
  const {sucursalesCombo} = useSelector(state => state.sucursales);
  const {loading} = useSelector(state => state.ui);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    lineas: [],
    doc_date: moment().format('YYYY-MM-DD'),
    comments: '',
    customer: '',
    docTotal: '0.00',
    errDocDate: false,
    errBranch: '',
    sucursalVenta: null,
    buscar: '',
    active: 0
  });

  const {doc_date, comments, customer, errDocDate, errBranch, docTotal, sucursalVenta, lineas, buscar, active} = state;

  useEffect(() => {
    dispatch(getSucursales('combo'));
    dispatch(getCotizaciones('lista'));
    dispatch(resetProductosLista());
  }, [dispatch]);

  const fields = [
    { key: 'product', label: 'Producto', _style: { width: '30%'} },
    { key: 'quantity', label: 'Cantidad', _style: { width: '25%'} },
    { key: 'price', label: 'Precio', _style: { width: '25%'} },
    { key: 'total', label: 'Subtotal', _style: { width: '15%'}, _classes: 'text-right font-weight-bold' },
    {
      key: 'acciones',
      label: '',
      _style: { width: '5%' },
      sorter: false,
      filter: false
    }
  ];

  const handleStateChange = ({target}) => {
    setState({
      ...state,
      [target.name]: target.value
    });
  }

  const handleSelectChangeBranch = (values) => {
    setState({
      ...state,
      sucursalVenta: values
    });
    buscarProducto(buscar, values.value);
  }

  const handleLineasChange = ({target}) => {
    const type = target.name.substring(0,1);
    const position = target.name.substring(1);

    const aux = JSON.parse(JSON.stringify(lineas));
    switch (type) {
      case 'q':
        aux[position].quantity = target.value;
        if(target.value === ''){
          aux[position].errorQuantity = true;
        }
        else{
          if((target.value * 1) > (target.max * 1)){
            aux[position].errorQuantity = true;
          }
          else{
            aux[position].errorQuantity = (target.value * 1) < (target.min * 1);
          }
        }
        break;
      case 'p':
        aux[position].price = target.value;
        if(target.value === '0'){
          aux[position].errorPrice = true;
        }
        else{
          aux[position].errorPrice = (target.value * 1) < (target.min * 1);
        }
        break;
      default: break;
    }
    let total = (aux[position].quantity) * (aux[position].price);
    aux[position].total = total.toFixed(2); // TODO: parametrizar

    let docTotal = TotalDocumento(aux);
    setState({
      ...state,
      lineas: aux,
      docTotal: docTotal.toFixed(2) // TODO: parametrizar
    });
  }

  const handleClickAdd = (producto) => {
    dispatch(uiCloseModal());
    if(producto.quantity === '0.00'){
      dispatch(uiOpenDialog(
        <span><i className='fa fa-exclamation-triangle' /> Alerta</span>,
        <span>No hay suficiente exitencia del producto <b>{producto.name}</b> en la sucursal <b>{sucursalVenta.label}</b></span>,
        '',
        'Cerrar',
        '')
      );
    }
    else {
      const exists = lineas.findIndex((linea) => linea.product.id === producto.id);
      if (exists === -1) {
        const aux = lineas;
        aux.push({
          quantity: 1,
          price: producto.price,
          minPrice: producto.price_wholesome,
          total: producto.price,
          maxQuantity: producto.quantity,
          product: {
            id: producto.id,
            code: producto.code,
            name: producto.name
          },
          errorQuantity: false,
          errorPrice: false
        });
        const total = TotalDocumento(aux);
        setState({
          ...state,
          lineas: aux,
          docTotal: total.toFixed(2) // TODO: parametrizar
        });
      } else {
        dispatch(uiOpenDialog(
          <span><i className='fa fa-exclamation-triangle'/> Alerta</span>,
          <span>El producto ya esta incluído en la cotización</span>,
          '',
          'Cerrar',
          '')
        );
      }
    }
  }

  const handleClickRemove = (x) => {
    const aux = lineas.filter((img, i) => i !== x);
    const total = TotalDocumento(aux);
    setState({
      ...state,
      lineas: aux,
      docTotal: total.toFixed(2) // TODO: parametrizar
    });
  }

  const isFormValid = () => {
    let valid = true;
    let invalid = {
      branch: '',
      doc_date: false,
    }

    if( doc_date.trim().length === 0){ invalid.doc_date = true; valid = false; }
    if(sucursalVenta === null || sucursalVenta === undefined){
      invalid.branch = 'este campo no puede estar vacío'; valid = false;
    }else{
      if(sucursalVenta.length === 0){
        invalid.branch = 'este campo no puede estar vacío'; valid = false;
      }
    }

    setState({
      ...state,
      errBranch: invalid.branch,
      errDocDate: invalid.doc_date
    });

    return valid;
  }

  const Cotizar = () => {
    if(isFormValid()){
      let result = lineas.find(obj => {
        return obj.errorQuantity === true || obj.errorPrice === true
      })
      if(!result){
        dispatch(setCotizacion({
          branch_id: sucursalVenta.value,
          doc_total: docTotal,
          customer,
          doc_date,
          comments,
          user_id: usuario.id,
          lineas: JSON.stringify(lineas)
        }));
        dispatch(uiOpenCotizacionesDialog(
          <span><i className='fa fa-exclamation-triangle' /> Confirmación</span>,
          <span>esta seguro que quiere realizar la cotización por <b>BOB {docTotal}</b>?</span>,
          'Cotizar',
          'Cerrar',
          'crear')
        );
      }
      else {
        dispatch(uiOpenDialog(
          <span><i className='fa fa-exclamation-triangle' /> Alerta</span>,
          <span>Hay errores en las líneas de detalle, solucionelos antes de continuar..</span>,
          '',
          'Cerrar',
          '')
        );
      }
    }
  }

  const resetForm = () => {
    setState({
      ...state,
      lineas: [],
      doc_date: moment().format('YYYY-MM-DD'),
      customer: '',
      comments: '',
      docTotal: '0.00',
      errDocDate: false,
      errBranch: '',
      sucursalVenta: null,
    });
  }

  const handleKeyUp = ({target}) => {
    buscarProducto(target.value, sucursalVenta?.value);
  }

  const buscarProducto = (buscar, sucursal) => {
    if(buscar !== ''){
      if(sucursal !== null && sucursal !== undefined){
        dispatch(getProductos('busqueda', {buscar, sucursal}));
      }
    }
  }

  const TotalDocumento = (lineas) => {
    let total = 0;
    lineas.forEach((linea) => {
      total += (linea.total * 1);
    });
    return total;
  }

  const openModal = (producto) => {
    dispatch(setProducto(producto));
    dispatch(uiOpenModal(
      <span>{producto.code} - {producto.name}</span>,
      'Agregar',
      '')
    );
  }

  const openModalCotizacion = (cotizacion) => {
    dispatch(setCotizacion(cotizacion));
    dispatch(uiOpenCotizacionesModal(
      <span> Detalle de Cotización</span>,
      '',
      '')
    );
  }

  const RealizarCotizacion = (cotizacion) => {
    dispatch(registerQuotation(cotizacion));
    setState({
      ...state,
      active: 1
    });
  }

  const RefreshCotizaciones = () => {
    dispatch(getCotizaciones('lista'));
  }

  return (
    <CRow>
      <CCol xs="6" className="d-print-none">
        <CCard>
          <CCardBody>
            <CTabs activeTab={active} onActiveTabChange={() => {setState({...state, active})}}>
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink>
                    <i className="fa fa-tags"/> Productos
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                    <i className="fa fa-clock-o"/> Cotizaciones Recientes
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane className="pt-3">
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-magnifying-glass" className="mr-1" />Buscar
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        name="buscar"
                        value={buscar}
                        onChange={handleStateChange}
                        onKeyUp={handleKeyUp}
                        placeholder="Nombre o Código de Producto" />
                    </CInputGroup>
                    {
                      sucursalVenta === null ? (
                        <span className="text-danger small">debe elegir una sucursal</span>
                      ) : (
                        <span className="text-primary small">Buscando productos en sucursal: <b>{sucursalVenta.label}</b></span>
                      )
                    }
                  </CFormGroup>
                  {
                    loading ? (
                      <h6><i className="fa fa-spinner fa-spin"/> buscando..</h6>
                    ) : (
                      productos.length === 0 ? (
                        <h6>No se encontraron resultados</h6>
                      ) :(
                        <CRow>
                          {
                            productos.map((item, x) => (
                              <CardProducto
                                producto={item}
                                agregar={() => {handleClickAdd(item)}}
                                modal={() => {openModal(item)}}
                                key={x}/>
                            ))
                          }
                        </CRow>
                      )
                    )
                  }
                </CTabPane>
                <CTabPane className="pt-3">
                  <div className="text-right mb-2">
                    <CButton
                      className="mr-1"
                      color="success"
                      size="sm"
                      variant="ghost"
                      onClick={RefreshCotizaciones}
                    ><i className="fa fa-refresh"/></CButton>
                    <CLink to="/Reportes">
                      <CButton
                        color="primary"
                        size="sm"
                        variant="ghost"
                      >Ver todas <i className="fa fa-angle-right"/></CButton>
                    </CLink>
                  </div>
                  <CListGroup accent>
                    {
                      (loading) ? (
                        <span className="text-muted"><i className="fa fa-spin fa-refresh"/> Cargando datos..</span>
                      ) : (
                        cotizaciones.map((cotizacion, x) => (
                          <CListGroupItem
                            accent={(x % 2 === 0) ? 'primary' : 'secondary'}
                            color={(x % 2 === 0) ? 'primary' : 'secondary'}
                            className="cursor-pointer"
                            action
                            onClick={()=>{openModalCotizacion(cotizacion)}}
                            key={cotizacion.id}>
                            <CRow>
                              <CCol xs="6">
                                <h5 className="text-primary m-0">BOB {cotizacion.doc_total}</h5>
                              </CCol>
                              <CCol xs="6">
                                <CTooltip content={moment(cotizacion.created_at).format('DD/MM/YYYY , h:mm:ss a')}>
                                  <span>{moment(cotizacion.created_at).fromNow()}</span>
                                </CTooltip>
                              </CCol>
                            </CRow>
                          </CListGroupItem>
                        ))
                      )
                    }
                  </CListGroup>
                </CTabPane>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="6" className="d-print-none">
        <CCard>
          <CCardHeader>
            <span className="h3">Cotización</span>
            <div className="card-header-actions">
              <CDropdown className="m-1">
                <CDropdownToggle color="primary">
                  Acciones
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={Cotizar} className="text-primary"><i className="fa fa-file-text-o pr-2"/> Realizar Cotización</CDropdownItem>
                  <CDropdownDivider />
                  <CDropdownItem onClick={resetForm} className="text-danger"><i className="fa fa-times pr-2"/> Borrar Formulario</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs="12">
                <CFormGroup>
                  <CLabel htmlFor="customer">Razón Social</CLabel>
                  <CInput
                    type="text"
                    name="customer"
                    value={customer || ''}
                    onChange={handleStateChange}/>
                </CFormGroup>
              </CCol>
              <CCol xs="6">
                <CFormGroup>
                  <CLabel htmlFor="branch">Sucursal</CLabel>
                  <Select
                    value={sucursalVenta}
                    onChange={handleSelectChangeBranch}
                    options={sucursalesCombo}
                    name="branch"/>
                  <span className="text-danger small">{errBranch}</span>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="total">Total</CLabel>
                  <h1 className="text-success"><span className="h3">BOB </span> {docTotal}</h1>
                </CFormGroup>
              </CCol>
              <CCol xs="6">
                <CFormGroup>
                  <CLabel htmlFor="doc_date">Fecha</CLabel>
                  <CInput
                    type="date"
                    name="doc_date"
                    readOnly={true}
                    value={doc_date || ''}
                    onChange={handleStateChange}
                    invalid={errDocDate}/>
                  <CInvalidFeedback>este campo no puede estar vacío</CInvalidFeedback>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="comments">Comentarios</CLabel>
                  <CTextarea
                    value={comments}
                    onChange={handleStateChange}
                    name="comments"
                    rows="2"
                  />
                </CFormGroup>
              </CCol>
            </CRow>
            <CDataTable
              items={lineas}
              fields={fields}
              size="sm"
              striped
              noItemsViewSlot={<h6 className="text-center text-muted">No se agregaron productos</h6>}
              scopedSlots = {{
                'product':
                  (item)=>(
                    <td>
                      {item.product.code + ' - ' + item.product.name}
                    </td>
                  ),
                'quantity':
                  (item,x)=>(
                    <td>
                      <CFormGroup className="mb-0">
                        <CInput
                          type="number"
                          size="sm"
                          max={item.maxQuantity}
                          min={1}
                          name={`q${x}` }
                          value={item.quantity}
                          invalid={item.errorQuantity}
                          valid={!item.errorQuantity}
                          onChange={handleLineasChange}/>
                        <CInvalidFeedback>la cantidad debe estar entre 1 y {item.maxQuantity * 1} </CInvalidFeedback>
                      </CFormGroup>
                    </td>
                  ),
                'price':
                  (item,x)=>(
                    <td>
                      <CFormGroup className="mb-0">
                        <CInput
                          className="text-right"
                          type="number"
                          size="sm"
                          min={item.minPrice}
                          name={`p${x}` }
                          value={item.price}
                          invalid={item.errorPrice}
                          valid={!item.errorPrice}
                          onChange={handleLineasChange}/>
                        <CInvalidFeedback>el precio debe ser mayor a {item.minPrice * 1}</CInvalidFeedback>
                      </CFormGroup>
                    </td>
                  ),
                'acciones':
                  (item,x)=>(
                    <td>
                      <CButton
                        color="danger"
                        variant="outline"
                        shape="square"
                        size="sm"
                        className="btn-icon"
                        onClick={()=>{handleClickRemove(x)}}
                      >
                        <i className="fa fa-trash font-lg"/>
                      </CButton>
                    </td>
                  )
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <Dialog/>
      <DialogCotizaciones f1={RealizarCotizacion}/>
      <ModalDetalleProducto action={handleClickAdd}/>
      <ModalCotizaciones f1={null}/>
    </CRow>
  )
}

export default POS
