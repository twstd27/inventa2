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
import { useTipoDeCambioStore } from '../../stores/useTipoDeCambioStore'

export const ModalTipoDeCambio = () => {
  const { modalOpen, modalTitle, modalButton, modalAction, closeModal } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { tipoDeCambio, error: errorForm, registerTipoDeCambio, modifyTipoDeCambio } = useTipoDeCambioStore()
  const [formValues, setFormValues] = useState(tipoDeCambio)
  const [errDescription, setErrDescription] = useState(false)

  useEffect(() => {
    if (tipoDeCambio) {
      setFormValues(tipoDeCambio)
    }
  }, [tipoDeCambio])

  const handleInputChange = ({ target }) => {
    setFormValues({ ...formValues, [target.name]: target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formValues.description || formValues.description.trim().length === 0) {
      setErrDescription(true)
      return
    }
    setErrDescription(false)
    if (modalAction === 'crear') {
      registerTipoDeCambio({ description: formValues.description, value: formValues.value })
    } else {
      modifyTipoDeCambio({ id: formValues.id, description: formValues.description, value: formValues.value })
    }
  }

  const CloseModal = () => closeModal()

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
              {errorForm.errors?.length !== 0 && (
                <ul>
                  {errorForm.errors?.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
            </CAlert>
          )}
          <CFormInput
            type="text"
            label="Descripción"
            name="description"
            value={formValues.description || ''}
            onChange={handleInputChange}
            feedbackInvalid="este campo no puede estar vacío"
            invalid={errDescription}
            className="mb-3"
          />
          <CFormInput
            type="number"
            label="Tipo de Cambio"
            name="value"
            value={formValues.value || 0}
            onChange={handleInputChange}
            step="0.0001"
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
