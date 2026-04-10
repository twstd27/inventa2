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
import { useUIStore } from '../../stores/useUIStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { usePreciosStore } from '../../stores/usePreciosStore'

export const ModalPrecios = () => {
  const { modalOpen, modalTitle, modalButton, modalAction, closeModal } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { usuario } = useAuthStore()
  const { precio: listaPrecio, error: errorForm, registerPriceList, modifyPriceList } = usePreciosStore()
  const [formValues, setFormValues] = useState(listaPrecio)

  useEffect(() => {
    if (listaPrecio) {
      setFormValues(listaPrecio)
    }
  }, [listaPrecio, setFormValues])

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
        registerPriceList({
          name,
          percent,
          user_id: usuario.id,
        })
      } else {
        modifyPriceList({
          id,
          name,
          percent,
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

  const { id, name, percent } = formValues

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
            type="number"
            label="Porcentaje sobre precio base"
            name="percent"
            value={percent || 0}
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
