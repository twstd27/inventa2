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
import { useUIStore } from '../../stores/useUIStore'
import { useRolesStore } from '../../stores/useRolesStore'
import { useLayoutStore } from '../../stores/useLayoutStore'
import Select from 'react-select'
import { SelectStyles } from '../../helpers/global'

export const ModalRoles = () => {
  const { modalOpen, modalTitle, modalButton, modalAction, closeModal } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { rol, modulos: modulosCombo, error: errorForm, registerRole, modifyRole } = useRolesStore()
  const [permisosRol, setPermisosRol] = useState(null)
  const [formValues, setFormValues] = useState(rol)
  const { id, name } = formValues
  const { theme } = useLayoutStore()

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
        registerRole({
          name,
          permissions: JSON.stringify(permisosRol),
        })
      } else {
        modifyRole({
          id,
          name,
          permissions: JSON.stringify(permisosRol),
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
    closeModal()
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
