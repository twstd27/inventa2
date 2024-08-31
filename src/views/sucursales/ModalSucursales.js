import {
  CAlert,
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseModal } from '../../actions/uiAction'
import { registerBranch, modifyBranch } from '../../actions/sucursalesAction'

export const ModalSucursales = () => {
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.auth)
  const { modalOpen, modalTitle, modalButton, modalAction, loading } = useSelector(
    (state) => state.ui,
  )
  const { sucursal, error: errorForm } = useSelector((state) => state.sucursales)
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
        dispatch(
          registerBranch({
            name,
            address,
            phone,
            user_id: usuario.id,
          }),
        )
      } else {
        dispatch(
          modifyBranch({
            id,
            name,
            address,
            phone,
          }),
        )
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

  const { id, name, address, phone } = formValues

  const CloseModal = () => {
    dispatch(uiCloseModal())
  }

  return (
    <CModal visible={modalOpen} onClose={CloseModal} color="primary">
      <CForm onSubmit={handleSubmit}>
        <CModalHeader closeButton>
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
