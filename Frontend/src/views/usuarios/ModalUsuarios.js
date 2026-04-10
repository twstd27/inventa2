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
import { useUsuariosStore } from '../../stores/useUsuariosStore'
import { useRolesStore } from '../../stores/useRolesStore'
import { useLayoutStore } from '../../stores/useLayoutStore'
import { SelectStyles } from '../../helpers/global'
// import validator from "validator";
import Select from 'react-select'

export const ModalUsuarios = () => {
  const { modalOpen, modalTitle, modalButton, modalAction, closeModal } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { usuario, error: errorForm, registerUser, modifyUser } = useUsuariosStore()
  const { rolesCombo } = useRolesStore()
  const [formValues, setFormValues] = useState(usuario)
  const { id, name, lastname, email, phone } = formValues
  const [rolUsuario, setRolUsuario] = useState(null)
  const { theme } = useLayoutStore()

  const selectStyles = SelectStyles(theme)

  useEffect(() => {
    if (usuario) {
      setFormValues(usuario)
      setRolUsuario({
        value: usuario.role_id,
        label: usuario.rol,
      })
      setState({
        password: '',
        repeatPassword: '',
        errName: false,
        errLastName: false,
        errEmail: false,
        errPassword: false,
        errRepeatpassword: false,
        errRole: '',
      })
    }
  }, [usuario, setFormValues])

  const [state, setState] = useState({
    password: '',
    repeatPassword: '',
    errName: false,
    errLastName: false,
    errEmail: false,
    errPassword: false,
    errRepeatpassword: false,
    errRole: '',
  })
  const {
    password,
    repeatPassword,
    errName,
    errLastName,
    errEmail,
    errPassword,
    errRepeatpassword,
    errRole,
  } = state

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    })
  }

  const handleStateChange = ({ target }) => {
    setState({
      ...state,
      [target.name]: target.value,
    })
  }

  const handleSelectChangeRole = (value) => {
    setRolUsuario(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFormValid()) {
      switch (modalAction) {
        case 'crear':
          registerUser({
            name,
            lastname,
            email,
            phone,
            password,
            role_id: rolUsuario.value,
          })
          break
        case 'modificar':
          modifyUser({
            id,
            name,
            lastname,
            email,
            phone,
            role_id: rolUsuario.value,
          })
          break
        default:
          break
      }
    }
  }

  const isFormValid = () => {
    let valid = true
    let invalid = {
      name: false,
      lastname: false,
      email: false,
      password: false,
      repeatpassword: false,
      role: '',
    }

    if (name.trim().length === 0) {
      invalid.name = true
      valid = false
    }
    if (lastname.trim().length === 0) {
      invalid.lastname = true
      valid = false
    }
    if (lastname.trim().length === 0) {
      invalid.email = true
      valid = false
    } // validar correo electrónico
    if (modalAction === 'crear') {
      if (password.trim().length < 5) {
        invalid.password = true
        valid = false
      }
      if (repeatPassword !== password) {
        invalid.repeatpassword = true
        valid = false
      }
    }
    if (rolUsuario === null || rolUsuario === undefined) {
      invalid.role = 'este campo no puede estar vacío'
      valid = false
    } else {
      if (rolUsuario.value === '') {
        invalid.role = 'este campo no puede estar vacío'
        valid = false
      }
    }

    setState({
      ...state,
      errName: invalid.name,
      errLastName: invalid.lastname,
      errEmail: invalid.email,
      errPassword: invalid.password,
      errRepeatpassword: invalid.repeatpassword,
      errRole: invalid.role,
    })

    return valid
  }

  const CloseModal = () => {
    closeModal()
  }

  return (
    <CModal visible={modalOpen} onClose={CloseModal}>
      <CForm onSubmit={handleSubmit}>
        <CModalHeader closeButton className="bg-primary">
          <CModalTitle className="text-white">{modalTitle}</CModalTitle>
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
            label="Nombres"
            name="name"
            value={name}
            onChange={handleInputChange}
            autoComplete="name"
            invalid={errName}
            feedbackInvalid="este campo no puede estar vacío"
          />
          <CFormInput
            type="text"
            label="Apellidos"
            name="lastname"
            value={lastname}
            onChange={handleInputChange}
            autoComplete="lastname"
            invalid={errLastName}
            feedbackInvalid="este campo no puede estar vacío"
          />
          <CFormInput
            type="text"
            label="Correo Electrónico"
            name="email"
            value={email}
            onChange={handleInputChange}
            autoComplete="email"
            invalid={errEmail}
            feedbackInvalid="este campo no puede estar vacío y debe ser un correo electrónico válido"
          />
          <CFormInput
            type="text"
            label="Teléfono"
            name="phone"
            value={phone || ''}
            autoComplete="phone"
            onChange={handleInputChange}
          />
          <CFormLabel htmlFor="role">Rol</CFormLabel>
          <Select
            styles={selectStyles}
            value={rolUsuario}
            onChange={handleSelectChangeRole}
            options={rolesCombo}
            name="role"
          />
          <span className="text-danger small">{errRole}</span>
          <br />
          {modalAction === 'crear' && (
            <>
              <CFormInput
                value={password}
                label="Contraseña"
                name="password"
                onChange={handleStateChange}
                invalid={errPassword}
                type="password"
                autoComplete="new-password"
                feedbackInvalid="el password debe tener como mínimo 5 caracteres"
              />
              <CFormInput
                value={repeatPassword}
                label="Repetir Password"
                name="repeatPassword"
                onChange={handleStateChange}
                invalid={errRepeatpassword}
                type="password"
                autoComplete="new-password"
                feedbackInvalid="las contraseñas no son iguales"
              />
            </>
          )}
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
