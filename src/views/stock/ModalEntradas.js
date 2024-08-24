import {
  CAlert,
  CButton, CCol, CDataTable,
  CForm,
  CFormGroup,
  CInput, CInvalidFeedback,
  CLabel,
  CModal,
  CModalBody, CModalFooter,
  CModalHeader,
  CModalTitle, CRow,
  CTextarea
} from "@coreui/react";
import Select from "react-select";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {uiCloseModal} from "../../actions/uiAction";
import {modifyEntry, registerEntry} from "../../actions/stockAction";

export const ModalEntradas = () => {
  const dispatch = useDispatch();
  const {usuario} = useSelector(state => state.auth);
  const {modalOpen, modalTitle, modalButton, modalAction, loading} = useSelector(state => state.ui);
  const {entrada, error:errorForm} = useSelector(state => state.stock);
  const {sucursalesCombo} = useSelector(state => state.sucursales);
  const {productosCombo} = useSelector(state => state.productos);
  const [formValues, setFormValues] = useState(entrada);
  const [sucursalEntrada, setSucursalEntrada] = useState(null);
  const [productoEntrada, setProductoEntrada] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [state, setState] = useState({
    quantity: '',
    cost: '',
    errBranch: false,
    errType: false,
    errDocDate: false,
    errDetails: '',
    errProduct: '',
    errQuantity: false,
    errCost: false,
    btnAdd: true,
    btnEdit: false
  });

  useEffect(() => {
    if(entrada){
      setFormValues(entrada);
      setSucursalEntrada({
        value: entrada.branch.id || '',
        label: entrada.branch.name || ''
      });
      setDetalles(entrada.entry_details);
      setState({
        quantity: '',
        cost: '',
        errBranch: false,
        errType: false,
        errDocDate: false,
        errDetails: '',
        errProduct: '',
        errQuantity: false,
        errCost: false,
        btnAdd: true,
        btnEdit: false,
        positio: -1
      });
    }
  }, [entrada, setFormValues]);

  const handleInputChange = ({target}) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    });
  }

  const handleStateChange = ({target}) => {
    setState({
      ...state,
      [target.name]: target.value
    });
  }

  const fields = [
    { key: 'product', label: 'Producto', _style: { width: '45%'} },
    { key: 'quantity', label: 'Cantidad', _style: { width: '25%'} },
    // { key: 'cost', label: 'Costo', _style: { width: '25%'} },
    {
      key: 'acciones',
      label: '',
      _style: { width: '15%' },
      sorter: false,
      filter: false
    }
  ];


  const {quantity, cost, errBranch, errType, errDocDate, errDetails, errProduct, errQuantity, errCost, btnAdd, btnEdit, position} = state;

  const handleSelectChangeBranch = (values) => {
    setSucursalEntrada(values);
  }

  const handleSelectChangeProduct = (values) => {
    setProductoEntrada(values);
    setState({
      ...state,
      cost: values.cost
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()){
      if (modalAction.action === 'crear'){
        dispatch(registerEntry({
          branch_id: sucursalEntrada.value,
          type: modalAction.type,
          doc_date,
          comments,
          user_id: usuario.id,
          detalles: JSON.stringify(detalles)
        }));
      }
      else{
        dispatch(modifyEntry({
          id,
          branch_id: sucursalEntrada.value,
          type: modalAction.type,
          doc_date,
          comments,
          detalles: JSON.stringify(detalles),
          borrar: JSON.stringify(entrada.entry_details)
        }));
      }
    }
  }

  const isFormValid = () => {
    let valid = true;
    let invalid = {
      branch: false,
      type: false,
      docDate: false,
      details: ''
    }

    if(sucursalEntrada === null || sucursalEntrada === undefined){
      invalid.branch = 'este campo no puede estar vacío'; valid = false;
    }else{
      if(sucursalEntrada.value === ''){
        invalid.branch = 'este campo no puede estar vacío'; valid = false;
      }
    }
    if( modalAction?.type.trim().length === 0){ invalid.type = true; valid = false; }
    if( doc_date === undefined){ invalid.docDate = true; valid = false; }
    if( detalles.length === 0){ invalid.details = 'debe existir por lo menos 1 producto agregado'; valid = false; }

    setState({
      ...state,
      errBranch: invalid.branch,
      errType: invalid.type,
      errDocDate: invalid.docDate,
      errDetails: invalid.details,
      errProduct: '',
      errQuantity: false,
      errCost: false
    });

    return valid;
  }

  const isAddProductValid = () => {
    let valid = {
      form: true,
      product: '',
      quantity: false,
      cost: false
    };
    if(productoEntrada === null || productoEntrada === undefined){
      valid.product = 'este campo no puede estar vacío'; valid.form = false;
    }else{
      if(productoEntrada.value === ''){
        valid.product = 'este campo no puede estar vacío'; valid.form = false;
      }
    }

    if(quantity.trim().length === 0 || (quantity*1) === 0){ valid.quantity = true; valid.form = false;}
    if(cost.trim().length === 0){ valid.cost = true; valid.form = false;}

    setState({
      ...state,
      errProduct: valid.product,
      errQuantity: valid.quantity,
      errCost: valid.cost,
      errDetails: ''
    });

    return valid.form;
  }

  const handleClickAdd = (type) => {
    if (isAddProductValid()){
      const parts = productoEntrada.label.split(' - ');
      const product = {
        quantity,
        cost,
        product: {
          id: productoEntrada.value,
          code: parts[0],
          name: parts[1]
        }
      };
      if(type === 'add'){
        setDetalles([
          ...detalles,
          product
          ]);
      }
      else{
        let aux = detalles;
        aux[position] = product;
        setDetalles(aux);
      }
      resetAddProduct();
    }
  }

  const handleClickEdit = (x) => {
    setState({
      ...state,
      quantity: detalles[x].quantity,
      cost: detalles[x].cost,
      errProduct: '',
      errQuantity: false,
      errCost: false,
      btnAdd: false,
      btnEdit: true,
      position: x
    });
    setProductoEntrada({
      value: detalles[x].product.id,
      label: detalles[x].product.code + ' - ' + detalles[x].product.name
    });
  }

  const handleClickRemove = (x) => {
    const aux = detalles.filter((img, i) => i !== x);
    setDetalles(aux);
  }

  const resetAddProduct = () => {
    setState({
      ...state,
      quantity: '',
      cost: '',
      errProduct: '',
      errQuantity: false,
      errCost: false,
      btnAdd: true,
      btnEdit: false,
      position: -1
      });
    setProductoEntrada(null);
  }

  // TODO: modificar funcion para guardar y modificar la entrada

  const {id, doc_date, comments} = formValues;

  const CloseModal= () =>{
    dispatch(uiCloseModal());
  }

  return(
    <CModal
      show={modalOpen}
      onClose={CloseModal}
      color="primary"
      size="lg"
      closeOnBackdrop={false}
    >
      <CForm onSubmit={handleSubmit}>
        <CModalHeader closeButton>
          <CModalTitle>{modalTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs="12">
              {
                (errorForm !== undefined && errorForm?.message !== '')  &&(
                  <CAlert color="danger">
                    {errorForm.message}
                    {
                      errorForm.errors.length !== 0 &&(
                        <ul>
                          {
                            errorForm.errors.map( (error, i) => (
                              <li key={i}>{ error }</li>
                            ))
                          }
                        </ul>
                      )
                    }
                  </CAlert>
                )
              }
            </CCol>
          </CRow>
          <CRow>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="branch">Sucursal</CLabel>
                <Select
                  value={sucursalEntrada}
                  onChange={handleSelectChangeBranch}
                  options={sucursalesCombo}
                  name="branch"/>
                <span className="text-danger small">{errBranch}</span>
              </CFormGroup>
            </CCol>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="type">Tipo</CLabel>
                <CInput
                  type="text"
                  name="type"
                  readOnly={true}
                  value={modalAction.type || ''}
                  onChange={handleInputChange}
                  invalid={errType}/>
                <CInvalidFeedback>este campo no puede estar vacío</CInvalidFeedback>
              </CFormGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="doc_date">Fecha</CLabel>
                <CInput
                  type="date"
                  name="doc_date"
                  value={doc_date || ''}
                  onChange={handleInputChange}
                  invalid={errDocDate}/>
                <CInvalidFeedback>este campo no puede estar vacío</CInvalidFeedback>
              </CFormGroup>
            </CCol>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="comments">Comentarios</CLabel>
                <CTextarea
                  value={(comments === null) ? '' : comments}
                  onChange={handleInputChange}
                  name="comments"
                  rows="2"
                />
              </CFormGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs="12" className="separator"/>
          </CRow>
          <CRow>
            <CCol xs="4">
              <CFormGroup>
                <CLabel htmlFor="product">Producto</CLabel>
                <Select
                  value={productoEntrada}
                  onChange={handleSelectChangeProduct}
                  options={productosCombo}
                  name="product"/>
                <span className="text-danger small">{errProduct}</span>
              </CFormGroup>
            </CCol>
            <CCol xs="3">
              <CFormGroup>
                <CLabel htmlFor="quantity">Cantidad</CLabel>
                <CInput
                  type="number"
                  name="quantity"
                  value={quantity}
                  onChange={handleStateChange}
                  invalid={errQuantity}/>
                <CInvalidFeedback>este campo no puede estar vacío o tener valor 0</CInvalidFeedback>
              </CFormGroup>
            </CCol>
            <CCol xs="3">
              <CFormGroup className="hidden">
                <CLabel htmlFor="cost">Costo</CLabel>
                <CInput
                  type="number"
                  name="cost"
                  value={cost}
                  onChange={handleStateChange}
                  invalid={errCost}/>
                <CInvalidFeedback>este campo no puede estar vacío</CInvalidFeedback>
              </CFormGroup>
            </CCol>
            <CCol xs="2">
              <br/>
              {
                (btnAdd) && (
                  <CButton
                    className="mt-2 ml-1"
                    color="primary"
                    onClick={()=>{handleClickAdd('add')}}
                  >
                    <i className="fa fa-plus-circle font-lg"/>
                  </CButton>
                )
              }
              {
                (btnEdit) && (
                  <>
                    <CButton
                      className="mt-2 ml-1"
                      color="primary"
                      onClick={()=>{handleClickAdd('edit')}}
                    >
                      <i className="fa fa-pencil font-lg"/>
                    </CButton>
                    <CButton
                      className="mt-2 ml-1"
                      color="secondary"
                      onClick={resetAddProduct}
                    >
                      <i className="fa fa-times font-lg"/>
                    </CButton>
                  </>
                )
              }
            </CCol>
          </CRow>
          <CRow>
            <CCol xs="12">
              <span className="text-danger small">{errDetails}</span>
              <CDataTable
                items={detalles}
                fields={fields}
                size="sm"
                itemsPerPage={5}
                pagination
                striped
                noItemsViewSlot={<h5 className="text-center text-muted">No se encontraron registros</h5>}
                scopedSlots = {{
                  'product':
                    (item)=>(
                      <td>
                          {item.product.code + ' - ' + item.product.name}
                      </td>
                    ),
                  'acciones':
                    (item,x)=>(
                      <td>
                        <CButton
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          className="btn-icon"
                          onClick={()=>{handleClickEdit(x)}}
                        >
                          <i className="fa fa-pencil font-lg"/>
                        </CButton>
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
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton type="submit" color="primary" disabled={loading}>
            {loading && (
              <>
                <i className="fa fa-spinner fa-spin"/>
              </>
            )}
            {!loading && <span> {modalButton}</span>}
          </CButton>{' '}
          <CButton
            color="secondary"
            onClick={CloseModal}
          >Cancelar</CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}
