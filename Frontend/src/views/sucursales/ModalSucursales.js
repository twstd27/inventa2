import {
  CAlert,
  CButton,
  CButtonGroup,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useUIStore } from '../../stores/useUIStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { useSucursalesStore } from '../../stores/useSucursalesStore'

export const ModalSucursales = () => {
  const { modalOpen, modalTitle, modalButton, modalAction, closeModal } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { usuario } = useAuthStore()
  const { sucursal, error: errorForm, registerBranch, modifyBranch } = useSucursalesStore()
  const [formValues, setFormValues] = useState(sucursal)

  useEffect(() => {
    if (sucursal) {
      setFormValues(sucursal)
    }
  }, [sucursal, setFormValues])

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    })
  }

  const [state, setState] = useState({
    errName: false,
  })

  const { errName } = state

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFormValid()) {
      if (modalAction === 'crear') {
        registerBranch({
          name,
          address,
          phone,
          venta_sin_stock,
          user_id: usuario.id,
        })
      } else {
        modifyBranch({
          id,
          name,
          address,
          phone,
          venta_sin_stock,
        })
      }
    }
  }

  const isFormValid = () => {
    let valid = true
    let invalid = {
      name: false,
    }

    if (name.trim().length === 0) {
      invalid.name = true
      valid = false
    }

    setState({
      ...state,
      errName: invalid.name,
    })

    return valid
  }

  const { id, name, address, phone, venta_sin_stock } = formValues

  const CloseModal = () => {
    closeModal()
  }

  return (
    <CModal visible={modalOpen} onClose={CloseModal} color="primary">
      <CForm onSubmit={handleSubmit}>
        <CModalHeader closeButton className="bg-primary text-white">
          <CModalTitle>{modalTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {errorForm !== undefined && errorForm?.message !== '' && (
            <CAlert color="danger">
              {errorForm.message}
              {errorForm.errors.length !== 0 && (
                <ul>
                  {errorForm.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
            </CAlert>
          )}
          <CFormInput
            type="text"
            label="Nombre"
            name="name"
            value={name}
            onChange={handleInputChange}
            feedbackInvalid="este campo no puede estar vacío"
            invalid={errName}
          />
          <CFormInput
            type="text"
            label="Dirección"
            name="address"
            value={address || ''}
            onChange={handleInputChange}
          />
          <CFormInput
            type="text"
            label="Teléfono"
            name="phone"
            value={phone || ''}
            onChange={handleInputChange}
          />
          <div className="mt-3">
            <CFormLabel>Venta sin stock</CFormLabel>
            <CButtonGroup role="group" className="w-100">
              <CButton
                color={venta_sin_stock === null ? 'secondary' : 'outline-secondary'}
                size="sm"
                onClick={() => setFormValues({ ...formValues, venta_sin_stock: null })}
              >
                Global
              </CButton>
              <CButton
                color={venta_sin_stock === true ? 'success' : 'outline-success'}
                size="sm"
                onClick={() => setFormValues({ ...formValues, venta_sin_stock: true })}
              >
                Permitir
              </CButton>
              <CButton
                color={venta_sin_stock === false ? 'danger' : 'outline-danger'}
                size="sm"
                onClick={() => setFormValues({ ...formValues, venta_sin_stock: false })}
              >
                Bloquear
              </CButton>
            </CButtonGroup>
            <small className="text-muted">
              {venta_sin_stock === null && 'Usa el parámetro global del sistema'}
              {venta_sin_stock === true && 'Esta sucursal puede vender sin stock'}
              {venta_sin_stock === false && 'Esta sucursal no puede vender sin stock'}
            </small>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton type="submit" color="primary" disabled={loading}>
            {loading && (
              <div className="spinner-border text-light spinner-border-sm" role="status">
                <span className="visually-hidden">cargando...</span>
              </div>
            )}
            {!loading && <span> {modalButton}</span>}
          </CButton>{' '}
          <CButton color="secondary" onClick={CloseModal}>
            Cancelar
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}
