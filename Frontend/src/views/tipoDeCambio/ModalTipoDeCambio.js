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
import { registerTipoDeCambio, modifyTipoDeCambio } from '../../actions/tipoDeCambioAction'

export const ModalTipoDeCambio = () => {
  const dispatch = useDispatch()
  const { modalOpen, modalTitle, modalButton, modalAction, loading } = useSelector(
    (state) => state.ui,
  )
  const { tipoDeCambio, error: errorForm } = useSelector((state) => state.tipoDeCambio)
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
      dispatch(registerTipoDeCambio({ description: formValues.description, value: formValues.value }))
    } else {
      dispatch(modifyTipoDeCambio({ id: formValues.id, description: formValues.description, value: formValues.value }))
    }
  }

  const CloseModal = () => dispatch(uiCloseModal())

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
