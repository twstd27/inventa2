import React, {useState, useEffect} from 'react';
import {
  CDataTable,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody, CFormGroup, CLabel, CInput
} from '@coreui/react';
import {useDispatch, useSelector} from "react-redux";
import {getDiario} from "../../actions/ventasAction";
import moment from "moment";
import Select from "react-select";

const DiarioVentas = () => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.ui);
  const {diario} = useSelector(state => state.ventas);
  const {sucursalesCombo} = useSelector(state => state.sucursales);
  const [state, setState] = useState({
    doc_date: moment().format('YYYY-MM-DD'),
    sucursalVenta: null,
    total: 0,
    profit: 0,
    tax: 0,
  });
  const {doc_date, sucursalVenta, total, profit, tax} = state;

  useEffect(() => {
    setState({
      ...state,
      total: 0,
      profit: 0,
      tax: 0,
    });
    totalesRegistros();
  }, [diario]); // eslint-disable-line react-hooks/exhaustive-deps

  const fields = [
    { key: 'id', label: 'venta', _style: { width: '5%'} },
    { key: 'invoice', label: 'Factura', _style: { width: '5%'} },
    { key: 'code', label: 'Código', _style: { width: '15%'} },
    { key: 'name', label: 'Nombre', _style: { width: '25%'} },
    { key: 'quantity', label: 'Cantidad', _style: { width: '10%'}, _classes: 'text-right' },
    { key: 'price', label: 'Precio/U', _style: { width: '10%'}, _classes: 'text-right' },
    { key: 'total', label: 'Subtotal', _style: { width: '10%'}, _classes: 'text-right' },
    { key: 'cost', label: 'Costo/U', _style: { width: '10%'}, _classes: 'text-right' },
    { key: 'cost_total', label: 'SubTotal Costo', _style: { width: '10%'}, _classes: 'text-right' },
    { key: 'profit', label: 'Ganancia', _style: { width: '10%'}, _classes: 'text-right' }
  ];

  const handleStateChange = ({target}) => {
    setState({
      ...state,
      [target.name]: target.value
    });
    buscarRegistros(target.value, sucursalVenta?.value || '');
  }

  const handleSelectChangeBranch = (values) => {
    setState({
      ...state,
      sucursalVenta: values
    });
    buscarRegistros(doc_date, values.value);
  }

  const buscarRegistros = (fecha, sucursal) => {
    if(fecha !== ''){
      if(sucursal !== null && sucursal !== undefined){
        dispatch(getDiario({fecha, sucursal}));
      }
    }
  }

  const totalesRegistros = () => {
    if (diario.length > 0){
      const aux = JSON.parse(JSON.stringify(diario));
      let auxTotal = 0;
      let auxTax = 0;
      let auxProfit = 0;
      aux.forEach((item) => {
        auxTotal += (item.total * 1);
        auxProfit += (item.profit * 1);
        if(item.invoice === 1){
          auxTax += (item.total * 1);
        }
      })
      auxTax *= 0.03;
      auxProfit -= auxTax;
      setState({
        ...state,
        total: auxTotal.toFixed(2),
        tax: auxTax.toFixed(2),
        profit: auxProfit.toFixed(2)
      });
    }
  }


  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardBody>
            <CRow>
              <CCol xs="3" className="d-print-none">
                <CFormGroup>
                  <CLabel htmlFor="branch">Sucursal</CLabel>
                  <Select
                    value={sucursalVenta}
                    onChange={handleSelectChangeBranch}
                    options={sucursalesCombo}
                    name="branch"/>
                </CFormGroup>
              </CCol>
              <CCol xs="3" className="d-print-none">
                <CFormGroup>
                  <CLabel htmlFor="doc_date">Fecha</CLabel>
                  <CInput
                    type="date"
                    name="doc_date"
                    value={doc_date || ''}
                    onChange={handleStateChange}/>
                </CFormGroup>
              </CCol>
              <CCol xs="6" className="pt-4 d-print-none">
                <CButton
                  color="primary"
                  disabled={loading}
                  onClick={() => {window.print()}}
                >
                  {
                    (loading) ? (
                      <span><i className="fa fa-spin fa-refresh"/> Cargando datos..</span>
                    ) : (
                      <span><i className="fa fa-print"/> Imprimir</span>
                    )
                  }
                </CButton>
              </CCol>
              <CCol xs="12" className="d-print-none separator" />
              <CCol xs="12" className="d-print-block">
                <div>
                  <h2>{sucursalVenta?.label}</h2>
                  <h2 className="text-center"><b>DIARIO</b> <span className="h3">ENTRADA DATOS</span></h2>
                  <h5><b>FECHA: </b>{moment(doc_date).format('DD/MM/YYYY')}</h5>
                </div>
                <CDataTable
                  items={diario}
                  fields={fields}
                  hover
                  border
                  size="sm"
                  noItemsViewSlot={<h5 className="text-center text-muted">No se encontraron registros</h5>}
                  scopedSlots = {{
                    'invoice':
                      (item)=>(
                        <td>
                          {((item.invoice === 1) ? 'si' : 'no')}
                        </td>
                      ),
                    'total':
                      (item)=>(
                        <td className="text-right">
                          {(item.total*1).toFixed(2)}
                        </td>
                      ),
                    'cost_total':
                      (item)=>(
                        <td className="text-right">
                          {((item.quantity*1)*(item.cost*1)).toFixed(2)}
                        </td>
                      ),
                    'profit':
                      (item)=>(
                        <td className="text-right">
                          {(item.profit*1).toFixed(2)}
                        </td>
                      ),
                  }}
                />
                <div>
                  <table className="w-100">
                    <tbody className="text-right">
                    <tr>
                      <th width="85%">Total:</th>
                      <th width="15%">{total}</th>
                    </tr>
                    <tr>
                      <th>Impuesto:</th>
                      <th>{tax}</th>
                    </tr>
                    <tr>
                      <th>Ganancia:</th>
                      <th>{profit}</th>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

  )
}

export default DiarioVentas
