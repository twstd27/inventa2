import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardImage,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CFormTextarea,
} from '@coreui/react'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseModal } from '../../actions/uiAction'
import { DISK } from '../../types/types'
import { modifyProduct, registerProduct } from '../../actions/productosAction'
import CIcon from '@coreui/icons-react'
import { cilX } from '@coreui/icons'
import { SelectStyles } from '../../helpers/global'

export const ModalProductos = () => {
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.auth)
  const { modalOpen, modalTitle, modalButton, modalAction, loading } = useSelector(
    (state) => state.ui,
  )

  const { theme } = useSelector((state) => state.layout)
  const selectStyles = SelectStyles(theme)

  const { marcasCombo } = useSelector((state) => state.marcas)
  const { categoriasCombo } = useSelector((state) => state.categorias)
  const { producto, error: errorForm } = useSelector((state) => state.productos)
  const [formValues, setFormValues] = useState(producto)
  const [categoriasProducto, setCategoriasProducto] = useState(null)
  const [marcaProducto, setMarcaProducto] = useState(null)
  const [imagen, setImagen] = useState('')
  const [imagenes, setImagenes] = useState([])
  const [tempImagenes, setTempImagenes] = useState([])
  const [tempImagenesData, setTempImagenesData] = useState([])
  const [state, setState] = useState({
    errName: false,
    errCode: false,
    errPrice: false,
    errPriceDiscount: false,
    errPriceWholesome: false,
    errCost: false,
    errImg: '',
    errCategories: '',
    errBrand: '',
  })

  useEffect(() => {
    if (producto) {
      setFormValues(producto)
      setMarcaProducto({
        value: producto.brand_id,
        label: producto.marca,
      })
      setImagenes(producto.images)
      setImagen('')
      setTempImagenes([])
      setTempImagenesData([])
      setCategoriasProducto(producto.categories)
      setState({
        errName: false,
        errCode: false,
        errPrice: false,
        errPriceDiscount: false,
        errPriceWholesome: false,
        errCost: false,
        errImg: '',
        errCategories: '',
        errBrand: '',
      })
    }
  }, [producto, setFormValues])

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    })
  }

  const handleSelectChangeBrand = (value) => {
    setMarcaProducto(value)
  }

  const handleSelectChangeCategories = (values) => {
    setCategoriasProducto(values)
  }

  const handleInputImgChange = (e) => {
    let errorValidation = ''
    let file = e.target.files[0]
    setImagen(e.target.value)
    switch (e.target.value.split('.').pop()) {
      case 'jpg':
      case 'png':
      case 'jpeg':
        if (e.target.files[0].size < 2000000) {
          const objectUrl = URL.createObjectURL(file)
          setTempImagenes([...tempImagenes, objectUrl])
          setTempImagenesData([...tempImagenesData, file])
        } else {
          errorValidation = 'el archivo debe pesar menos de 2Mb'
        }
        break
      default:
        errorValidation = 'extensiones de imagenes permitidas: .jpg .jpeg .png'
        break
    }
    setState({
      ...state,
      errImg: errorValidation,
    })
  }

  const deleteTempImg = (x) => {
    const aux = tempImagenes.filter((img, i) => i !== x)
    const aux2 = tempImagenesData.filter((img, i) => i !== x)
    setTempImagenes(aux)
    setTempImagenesData(aux2)
  }

  const deleteImg = (x) => {
    const aux = imagenes.filter((img) => img.id !== x)
    setImagenes(aux)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFormValid()) {
      const productCategories = categoriasProducto.map(function (obj) {
        return obj.value
      })
      switch (modalAction) {
        case 'crear':
          dispatch(
            registerProduct(
              {
                name,
                code,
                description,
                price,
                price_discount,
                price_wholesome,
                cost,
                user_id: usuario.id,
                brand_id: marcaProducto.value,
                categories: productCategories,
              },
              tempImagenesData,
            ),
          )
          break
        case 'modificar':
          const diferencia = producto.images.filter((x) => !imagenes.includes(x))
          dispatch(
            modifyProduct(
              {
                id,
                name,
                code,
                description,
                price,
                price_discount,
                price_wholesome,
                cost,
                brand_id: marcaProducto.value,
                categories: productCategories,
              },
              tempImagenesData,
              diferencia,
            ),
          )
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
      code: false,
      price: false,
      price_discount: false,
      price_wholesome: false,
      categories: '',
      brand: '',
      cost: false,
    }

    if (name.trim().length === 0) {
      invalid.name = true
      valid = false
    }
    if (code.trim().length === 0) {
      invalid.code = true
      valid = false
    }
    if (isNaN(price)) {
      invalid.price = true
      valid = false
    }
    if (isNaN(price_discount)) {
      invalid.price_discount = true
      valid = false
    }
    if (isNaN(price_wholesome)) {
      invalid.price_wholesome = true
      valid = false
    }
    if (isNaN(cost)) {
      invalid.cost = true
      valid = false
    }
    if (categoriasProducto === null || categoriasProducto === undefined) {
      invalid.categories = 'este campo no puede estar vacío'
      valid = false
    } else {
      if (categoriasProducto.length === 0) {
        invalid.categories = 'este campo no puede estar vacío'
        valid = false
      }
    }
    if (marcaProducto === null || marcaProducto === undefined) {
      invalid.brand = 'este campo no puede estar vacío'
      valid = false
    } else {
      if (marcaProducto.value === '') {
        invalid.brand = 'este campo no puede estar vacío'
        valid = false
      }
    }

    setState({
      ...state,
      errName: invalid.name,
      errCode: invalid.code,
      errPrice: invalid.price,
      errCost: invalid.cost,
      errPriceDiscount: invalid.price_discount,
      errPriceWholesome: invalid.price_wholesome,
      errCategories: invalid.categories,
      errBrand: invalid.brand,
      errImg: '',
    })

    return valid
  }

  const {
    errName,
    errCode,
    errImg,
    errPrice,
    errCost,
    errPriceDiscount,
    errPriceWholesome,
    errCategories,
    errBrand,
  } = state
  const { id, name, description, code, price, price_discount, price_wholesome, cost } = formValues

  const CloseModal = () => {
    dispatch(uiCloseModal())
  }

  return (
    <CModal visible={modalOpen} onClose={CloseModal} size="lg">
      <CForm onSubmit={handleSubmit}>
        <CModalHeader closeButton className="bg-primary text-white">
          <CModalTitle>{modalTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs="12">
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
            </CCol>
          </CRow>
          <CRow>
            <CCol xs="6">
              <CFormInput
                type="text"
                label="Nombre"
                name="name"
                value={name}
                onChange={handleInputChange}
                feedbackInvalid="este campo no puede estar vacío"
                invalid={errName}
              />
            </CCol>
            <CCol xs="6">
              <CFormInput
                type="text"
                label="Código"
                name="code"
                value={code}
                onChange={handleInputChange}
                feedbackInvalid="este campo no puede estar vacío"
                invalid={errCode}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol xs="6">
              <CFormLabel htmlFor="brand">Marca</CFormLabel>
              <Select
                value={marcaProducto}
                styles={selectStyles}
                onChange={handleSelectChangeBrand}
                options={marcasCombo}
                name="brand"
              />
              <span className="text-danger small">{errBrand}</span>
            </CCol>
            <CCol xs="6">
              <CFormLabel htmlFor="categories">Categorias</CFormLabel>
              <Select
                value={categoriasProducto}
                styles={selectStyles}
                isMulti
                onChange={handleSelectChangeCategories}
                options={categoriasCombo}
                name="categories"
              />
              <span className="text-danger small">{errCategories}</span>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs="6">
              <CFormInput
                type="number"
                label="Costo"
                name="cost"
                value={cost || 0}
                onChange={handleInputChange}
                feedbackInvalid="este campo debe ser un número"
                invalid={errCost}
              />
            </CCol>
            <CCol xs="6">
              <CFormInput
                type="number"
                label="Precio"
                name="price"
                value={price || 0}
                onChange={handleInputChange}
                feedbackInvalid="este campo debe ser un número"
                invalid={errPrice}
              />
            </CCol>
            <CCol xs="6">
              <CFormInput
                type="number"
                label="Precio con descuento"
                name="price_discount"
                value={price_discount || 0}
                onChange={handleInputChange}
                feedbackInvalid="este campo debe ser un número"
                invalid={errPriceDiscount}
              />
            </CCol>
            <CCol xs="6">
              <CFormInput
                type="number"
                label="Precio por mayor"
                name="price_wholesome"
                value={price_wholesome || 0}
                onChange={handleInputChange}
                feedbackInvalid="este campo debe ser un número"
                invalid={errPriceWholesome}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol xs="6">
              <CFormInput
                name="image"
                label="Imágenes"
                value={imagen}
                type="file"
                onChange={handleInputImgChange}
                accept="image/x-png,image/gif,image/jpeg"
              />
              <span className="text-danger small">{errImg}</span>
              <br />
              <div>
                <CRow>
                  {imagenes.map((img) => (
                    <CCol key={img.id} xs="4">
                      <CButton
                        color="danger"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          deleteImg(img.id)
                        }}
                      >
                        <CIcon icon={cilX} />
                      </CButton>
                      <CCard>
                        <CCardImage width="100%" src={`${DISK}/${img.name}`} alt="img" />
                      </CCard>
                    </CCol>
                  ))}
                  {tempImagenes.map((img, i) => (
                    <CCol key={i} xs="4">
                      <CButton
                        color="danger"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          deleteTempImg(i)
                        }}
                      >
                        <CIcon icon={cilX} />
                      </CButton>
                      <CCard>
                        <CCardImage width="100%" src={img} alt="img" />
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              </div>
            </CCol>
            <CCol xs="6">
              <CFormTextarea
                value={description === null ? '' : description}
                label="Descripción"
                onChange={handleInputChange}
                name="description"
                rows="3"
              />
            </CCol>
          </CRow>
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
