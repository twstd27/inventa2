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
  CFormTextarea,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useUIStore } from '../../stores/useUIStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { useCategoriasStore } from '../../stores/useCategoriasStore'

export const ModalCategorias = () => {
  const { usuario } = useAuthStore()
  const { modalOpen, modalTitle, modalButton, modalAction, closeModal } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { categoria, error: errorForm, registerCategory, modifyCategory } = useCategoriasStore()
  const [formValues, setFormValues] = useState(categoria)

  useEffect(() => {
    if (categoria) {
      setFormValues(categoria)
    }
  }, [categoria, setFormValues])

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
        registerCategory({
          name,
          description,
          user_id: usuario.id,
        })
      } else {
        modifyCategory({
          id,
          name,
          description,
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

  const { id, name, description } = formValues

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
          <CFormTextarea
            value={description === null ? '' : description}
            label="Descripción"
            onChange={handleInputChange}
            name="description"
            rows="3"
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
