import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from '../../../hooks/useForm'
import { startLogin } from '../../../actions/authAction'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [validatedUser, setValidatedUser] = useState(false)
  const [validatedPassword, setValidatedPassword] = useState(false)
  const { loading } = useSelector((state) => state.ui)
  const { error: errLogin, logged } = useSelector((state) => state.auth)
  const [formValues, handleInputChange] = useForm({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (logged === true) {
      navigate('/dashboard')
    }
  }, [logged, navigate])

  const handleLogin = (event) => {
    event.preventDefault()
    if (!HandleValidation()) {
      event.stopPropagation()
      return
    }
    dispatch(startLogin(email, password))
  }

  const { email, password } = formValues

  const HandleValidation = () => {
    if (email === '') {
      setValidatedUser(true)
      return false
    }
    setValidatedUser(false)

    if (password === '') {
      setValidatedPassword(true)
      return false
    }
    setValidatedPassword(false)

    return true
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Iniciar Sesión</h1>
                    <p className="text-body-secondary">accede a tu cuenta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Correo Electrónico"
                        autoComplete="email"
                        value={email}
                        name="email"
                        onChange={handleInputChange}
                        type="text"
                        invalid={validatedUser}
                        feedbackInvalid="este campo no puede estar vacío"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        value={password}
                        name="password"
                        onChange={handleInputChange}
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        invalid={validatedPassword}
                        feedbackInvalid="este campo no puede estar vacío"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4" disabled={loading}>
                          {loading ? (
                            <>
                              {/* <i className="fa fa-spinner fa-spin" /> */}
                              <div
                                className="spinner-border text-light spinner-border-sm"
                                role="status"
                              >
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            </>
                          ) : (
                            <span>Acceder</span>
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs="12">
                        <br />
                        {loading
                          ? ''
                          : errLogin !== undefined &&
                            errLogin.message !== '' &&
                            !loading && (
                              <CAlert color="danger">
                                <span>{errLogin.message}</span>
                              </CAlert>
                            )}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>InVenta</h2>
                    <p>Módulo de administración de inventarios y ventas</p>
                    <img width="200" src="./logo.jpg" alt="" />
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
