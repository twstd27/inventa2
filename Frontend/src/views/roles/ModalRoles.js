import {
  CAlert,
  CButton,
  CForm,
  // CFormGroup,
  CFormInput,
  // CInvalidFeedback,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseModal } from '../../actions/uiAction'
import { registerRole, modifyRole } from '../../actions/rolesAction'
import Select from 'react-select'
import { SelectStyles } from '../../helpers/global'

export const ModalRoles = () => {
  const dispatch = useDispatch()
  const { modalOpen, modalTitle, modalButton, modalAction, loading } = useSelector(
    (state) => state.ui,
  )
  const { rol, modulos: modulosCombo, error: errorForm } = useSelector((state) => state.roles)
  const [permisosRol, setPermisosRol] = useState(null)
  const [formValues, setFormValues] = useState(rol)
  const { id, name } = formValues
  const { theme } = useSelector((state) => state.layout)

  const selectStyles = SelectStyles(theme)

  useEffect(() => {
    if (rol) {
      setPermisosRol([])
      setState({
        errName: false,
        errPermissions: '',
      })
      setFormValues(rol)
      setPermisosRol(rol.permissions)
    }
  }, [rol, setFormValues])

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    })
  }

  const [state, setState] = useState({
    errName: false,
    errPermissions: '',
  })

  const { errName, errPermissions } = state

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFormValid()) {
      if (modalAction === 'crear') {
        dispatch(
          registerRole({
            name,
            permissions: JSON.stringify(permisosRol),
          }),
        )
      } else {
        dispatch(
          modifyRole({
            id,
            name,
            permissions: JSON.stringify(permisosRol),
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

    if (permisosRol === null || permisosRol === undefined) {
      invalid.permissions = 'este campo no puede estar vacío'
      valid = false
    } else {
      if (permisosRol.length === 0) {
        invalid.permissions = 'este campo no puede estar vacío'
        valid = false
      }
    }

    setState({
      ...state,
      errName: invalid.name,
      errPermissions: invalid.permissions,
    })

    return valid
  }

  const handleSelectChange = (value) => {
    setPermisosRol(value)
  }

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
          <CFormLabel htmlFor="permissions">Permisos</CFormLabel>
          <Select
            value={permisosRol}
            label="Permisos"
            isMulti
            onChange={handleSelectChange}
            options={modulosCombo}
            styles={selectStyles}
            name="permissions"
          />
          <span className="text-danger small">{errPermissions}</span>
        </CModalBody>
        <CModalFooter>
          <CButton type="submit" color="primary" disabled={loading}>
            {loading && (
              <>
                <div className="spinner-border text-light spinner-border-sm" role="status">
                  <span className="visually-hidden">cargando...</span>
                </div>
              </>
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
