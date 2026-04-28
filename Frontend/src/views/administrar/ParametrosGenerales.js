import React, { useState, useEffect, useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormSwitch,
  CButton,
  CRow,
  CCol,
  CTabs,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CCardHeader,
  CToast,
  CToastBody,
  CToaster,
  CToastHeader,
} from '@coreui/react'
import Select from 'react-select'
import { SelectStyles } from '../../helpers/global'
import { useTipoDeCambioStore } from '../../stores/useTipoDeCambioStore'
import { useLayoutStore } from '../../stores/useLayoutStore'
import { usePreciosStore } from '../../stores/usePreciosStore'
import { useParamsStore } from '../../stores/useParamsStore'

import CIcon from '@coreui/icons-react'
import { cilCog, cilSave } from '@coreui/icons'

const ParametrosGenerales = () => {
  const [toast, addToast] = useState()
  const toaster = useRef(null)
  const [preciosCombo, setPreciosCombo] = useState([])
  const [params, setParams] = useState([])
  const [formLoading, setFormLoading] = useState(true)
  const { tiposDeCambioCombo, getTiposDeCambio } = useTipoDeCambioStore()
  const { theme } = useLayoutStore()
  const selectStyles = SelectStyles(theme)
  const { getPrecios } = usePreciosStore()
  const { getParams, modifyParam } = useParamsStore()

  useEffect(() => {
    setFormLoading(true)
    const fetchPrecios = async () => {
      try {
        const data = await getPrecios('combo')
        setPreciosCombo(data)
      } catch (error) {
        console.error('Error fetching precios:', error)
      }
    }
    fetchPrecios()
    getTiposDeCambio('combo')
    setFormLoading(false)
  }, [])

  useEffect(() => {
    setFormLoading(true)
    const fetchParams = async () => {
      try {
        const data = await getParams()
        setParams(data)
      } catch (error) {
        console.error('Error fetching params:', error)
      }
    }
    fetchParams()
    setFormLoading(false)
  }, [])

  const handleChange = async (e) => {
    if (formLoading) return

    const { name, value, type, checked } = e.target
    const idParam = parseInt(name.split('_')[1])

    try {
      await modifyParam(idParam, { value: type === 'checkbox' ? (checked ? '1' : '0') : value })
      addToast(saveToast('success', 'Parámetro modificado'))
    } catch (error) {
      console.error('Error fetching params:', error)
      addToast(saveToast('danger', 'error al modificar parámetro'))
    }

    setParams((prevParams) =>
      prevParams.map((param) =>
        param.id === idParam
          ? { ...param, value: type === 'checkbox' ? (checked ? '1' : '0') : value }
          : param,
      ),
    )
  }

  const handleTipoCambioSelect = async (selected) => {
    if (formLoading || !selected) return
    const tipoCambioParam = params.find((p) => p.name === 'TipoCambio')
    if (!tipoCambioParam) return

    try {
      await modifyParam(tipoCambioParam.id, { value: String(selected.value_id) })
      addToast(saveToast('success', 'Tipo de cambio actualizado'))
    } catch (error) {
      addToast(saveToast('danger', 'Error al actualizar tipo de cambio'))
    }

    setParams((prevParams) =>
      prevParams.map((param) =>
        param.id === tipoCambioParam.id ? { ...param, value: String(selected.value_id) } : param,
      ),
    )
  }

  const saveToast = (color, message) => (
    <CToast color={color}>
      <CToastBody>
        <CIcon icon={cilSave} /> {message}
      </CToastBody>
    </CToast>
  )

  const tipoCambioParam = params.find((p) => p.name === 'TipoCambio')
  const tipoCambioSelected =
    tiposDeCambioCombo.find((r) => r.value_id === parseInt(tipoCambioParam?.value)) || null

  return (
    <>
      <CToaster className="p-3" placement="bottom-end" push={toast} ref={toaster} />
      <CTabs activeItemKey="parametros">
        <CTabList variant="tabs">
          <CTab itemKey="parametros">Parámetros Generales</CTab>
          <CTab itemKey="desarrollador">Opciones de desarrollador</CTab>
        </CTabList>
        <CTabContent>
          <CTabPanel itemKey="parametros">
            <CCard className="mt-1">
              <CCardHeader className="d-flex justify-content-between align-items-center">
                <div className="card-header-actions text-start">
                  <CCardTitle>
                    <CIcon icon={cilCog} /> Configuración de parámetros generales
                  </CCardTitle>
                </div>
              </CCardHeader>
              <CCardBody style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <CCardTitle>Ventas</CCardTitle>
                <CRow>
                  <CCol style={{ marginLeft: '20px' }}>
                    <CFormLabel>Tipo de Cambio global (TipoCambio)</CFormLabel>
                    <Select
                      styles={selectStyles}
                      value={tipoCambioSelected}
                      onChange={handleTipoCambioSelect}
                      options={tiposDeCambioCombo}
                      getOptionValue={(o) => o.value_id}
                      placeholder="Seleccione tipo de cambio..."
                    />
                    <CFormSwitch
                      label={params[0]?.description}
                      className="mt-3"
                      id={`param_${params[0]?.id}`}
                      name={`param_${params[0]?.id}`}
                      checked={params[0]?.value === '1'}
                      onChange={handleChange}
                    />
                    <CFormSwitch
                      label={params[2]?.description}
                      className="mt-3"
                      id={`param_${params[2]?.id}`}
                      name={`param_${params[2]?.id}`}
                      checked={params[2]?.value === '1'}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <hr style={{ borderTop: '1px dashed #4b4a4a' }} />
                <CCardTitle>Productos</CCardTitle>
                <CRow className="mt-2">
                  <CCol style={{ marginLeft: '20px' }}>
                    {(() => {
                      const p = params.find((x) => x.name === 'RedondeoPrecios')
                      if (!p) return null
                      return (
                        <>
                          <CFormLabel>Redondeo de precios en POS</CFormLabel>
                          <CFormSelect
                            id={'param_' + p.id}
                            name={'param_' + p.id}
                            value={p.value}
                            onChange={handleChange}
                          >
                            <option value="0">Sin redondeo</option>
                            <option value="1">Al entero (Bs 1, 2, 3...)</option>
                            <option value="5">Al múltiplo de 5 (Bs 5, 10, 15...)</option>
                            <option value="10">Al múltiplo de 10 (Bs 10, 20, 30...)</option>
                            <option value="50">Al múltiplo de 50 (Bs 50, 100, 150...)</option>
                          </CFormSelect>
                        </>
                      )
                    })()}
                  </CCol>
                </CRow>
                <hr style={{ borderTop: '1px dashed #4b4a4a' }} />
                <CCardTitle>Inventarios</CCardTitle>
                <hr style={{ borderTop: '1px dashed #4b4a4a' }} />
                <CCardTitle>Usuarios</CCardTitle>
                <hr style={{ borderTop: '1px dashed #4b4a4a' }} />
                <CCardTitle>Sucursales</CCardTitle>
                <hr style={{ borderTop: '1px dashed #4b4a4a' }} />
                <CCardTitle>General</CCardTitle>
                <hr style={{ borderTop: '1px dashed #4b4a4a' }} />
              </CCardBody>
            </CCard>
          </CTabPanel>
          <CTabPanel itemKey="desarrollador">...</CTabPanel>
        </CTabContent>
      </CTabs>
    </>
  )
}

export default ParametrosGenerales
