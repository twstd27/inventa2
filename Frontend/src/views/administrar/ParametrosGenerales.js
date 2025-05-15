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
import { useDispatch, useSelector } from 'react-redux'
import { getPrecios } from '../../actions/preciosAction'
import { getParams, modifyParam } from '../../actions/paramsAction'

import CIcon from '@coreui/icons-react'
import { cilCog, cilSave } from '@coreui/icons'

const ParametrosGenerales = () => {
  const dispatch = useDispatch()
  const [toast, addToast] = useState()
  const toaster = useRef(null)
  const [preciosCombo, setPreciosCombo] = useState([])
  const [params, setParams] = useState([])
  const [formLoading, setFormLoading] = useState(true)

  useEffect(() => {
    setFormLoading(true)
    const fetchPrecios = async () => {
      try {
        const data = await dispatch(getPrecios('combo'))
        setPreciosCombo(data)
      } catch (error) {
        console.error('Error fetching precios:', error)
      }
    }

    fetchPrecios()
    setFormLoading(false)
  }, [dispatch])

  useEffect(() => {
    setFormLoading(true)
    const fetchParams = async () => {
      try {
        const data = await dispatch(getParams())
        setParams(data)
      } catch (error) {
        console.error('Error fetching params:', error)
      }
    }

    fetchParams()
    setFormLoading(false)
  }, [dispatch])

  const handleChange = async (e) => {
    if (formLoading) return

    const { name, value, type, checked } = e.target

    const idParam = parseInt(name.split('_')[1])

    try {
      const data = await dispatch(
        modifyParam(idParam, { value: type === 'checkbox' ? (checked ? '1' : '0') : value }),
      )
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

  const saveToast = (color, message) => (
    <CToast color={color}>
      <CToastBody>
        <CIcon icon={cilSave} /> {message}
      </CToastBody>
    </CToast>
  )

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
                    <CFormLabel htmlFor={`param_${params[1]?.id}`}>
                      {params[1]?.description}
                    </CFormLabel>
                    <CFormSelect
                      aria-label={params[1]?.description}
                      id={`param_${params[1]?.id}`}
                      name={`param_${params[1]?.id}`}
                      value={params[1]?.value}
                      options={preciosCombo}
                      onChange={handleChange}
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
