import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  CInputGroup,
  CInputGroupText,
  CAlertLink,
} from '@coreui/react'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseModal } from '../../actions/uiAction'
import { DISK } from '../../types/types'
import { modifyProduct, registerProduct } from '../../actions/productosAction'
import { getParams } from '../../actions/paramsAction'
import CIcon from '@coreui/icons-react'
import { cilX, cilPen, cilImagePlus, cilCamera } from '@coreui/icons'
import { SelectStyles } from '../../helpers/global'
import imageCompression from 'browser-image-compression'

export const ModalProductos = () => {
  const navigate = useNavigate()
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
  const [formLoading, setFormLoading] = useState(false)
  const [categoriasProducto, setCategoriasProducto] = useState(null)
  const [marcaProducto, setMarcaProducto] = useState(null)
  const [imagen, setImagen] = useState('')
  const [imagenes, setImagenes] = useState([])
  const [tempImagenes, setTempImagenes] = useState([])
  const [tempImagenesData, setTempImagenesData] = useState([])
  const [params, setParams] = useState([])
  const [state, setState] = useState({
    errName: false,
    errCode: false,
    errPrice: false,
    errPriceDiscount: false,
    errPriceWholesome: false,
    errCost: false,
    errPricePercent: false,
    errDiscountPercent: false,
    errWholesomePercent: false,
    errCostUsd: false,
    errImg: '',
    errCategories: '',
    errBrand: '',
  })

  useEffect(() => {
    if (producto) {
      setFormLoading(true)
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
        errPricePercent: false,
        errDiscountPercent: false,
        errWholesomePercent: false,
        errCostUsd: false,
        errImg: '',
        errCategories: '',
        errBrand: '',
      })
      setTimeout(() => setFormLoading(false), 0)
    }
  }, [producto, setFormValues])

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const data = await dispatch(getParams())
        setParams(data)
      } catch (error) {
        console.error('Error fetching params:', error)
      }
    }

    fetchParams()
  }, [dispatch])

  // Recalcula precios cuando cambian params, producto o los campos relevantes
  useEffect(() => {
    if (!params.length) return
    let tipoCambio = params[3]?.value ? parseFloat(params[3].value) : 6.96
    let cost_usd = parseFloat(formValues.cost_usd) || 0
    let cost = cost_usd ? (tipoCambio * cost_usd).toFixed(2) : parseFloat(formValues.cost) || 0
    const pricePercent = parseFloat(formValues.price_percent) || 0
    const wholesomePercent = parseFloat(formValues.wholesome_percent) || 0
    const discountPercent = parseFloat(formValues.discount_percent) || 0
    const price = (cost * (1 + pricePercent)).toFixed(2)
    const price_wholesome = (cost * (1 + wholesomePercent)).toFixed(2)
    const price_discount = (cost * (1 + discountPercent)).toFixed(2)
    setFormValues((prev) => ({
      ...prev,
      cost,
      price,
      price_wholesome,
      price_discount,
    }))
  }, [
    params,
    producto,
    formValues.cost_usd,
    formValues.price_percent,
    formValues.wholesome_percent,
    formValues.discount_percent,
  ])

  const handleInputChange = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value
    let newFormValues = {
      ...formValues,
      [target.name]: value,
    }

    // Solo hacer cálculos si no estamos cargando el formulario
    if (!formLoading) {
      // Si el campo modificado es price_percent, recalcula price
      if (target.name === 'price_percent') {
        const costNum = parseFloat(newFormValues.cost) || 0
        const percentNum = parseFloat(value) || 0
        newFormValues.price = (costNum * (1 + percentNum)).toFixed(2)
      }

      // Si el campo modificado es wholesome_percent, recalcula price_wholesome
      if (target.name === 'wholesome_percent') {
        const costNum = parseFloat(newFormValues.cost) || 0
        const percentNum = parseFloat(value) || 0
        newFormValues.price_wholesome = (costNum * (1 + percentNum)).toFixed(2)
      }

      // Si el campo modificado es discount_percent, recalcula price_discount
      if (target.name === 'discount_percent') {
        const costNum = parseFloat(newFormValues.cost) || 0
        const percentNum = parseFloat(value) || 0
        newFormValues.price_discount = (costNum * (1 + percentNum)).toFixed(2)
      }

      // Si el campo modificado es cost, recalcula todos los precios dependientes
      if (target.name === 'cost') {
        const costNum = parseFloat(value) || 0
        const pricePercent = parseFloat(newFormValues.price_percent) || 0
        const wholesomePercent = parseFloat(newFormValues.wholesome_percent) || 0
        const discountPercent = parseFloat(newFormValues.discount_percent) || 0
        if (pricePercent) {
          newFormValues.price = (costNum * (1 + pricePercent)).toFixed(2)
        }
        if (wholesomePercent) {
          newFormValues.price_wholesome = (costNum * (1 + wholesomePercent)).toFixed(2)
        }
        if (discountPercent) {
          newFormValues.price_discount = (costNum * (1 + discountPercent)).toFixed(2)
        }
      }

      // Si el campo modificado es cost_usd, recalcula cost en base a tipoCambio
      if (target.name === 'cost_usd') {
        const costUsdNum = parseFloat(value) || 0
        newFormValues.cost = (tipoCambio * costUsdNum).toFixed(2)
        // También recalcula los precios dependientes si hay porcentajes
        const pricePercent = parseFloat(newFormValues.price_percent) || 0
        const wholesomePercent = parseFloat(newFormValues.wholesome_percent) || 0
        const discountPercent = parseFloat(newFormValues.discount_percent) || 0
        if (pricePercent) {
          newFormValues.price = (parseFloat(newFormValues.cost) * (1 + pricePercent)).toFixed(2)
        }
        if (wholesomePercent) {
          newFormValues.price_wholesome = (
            parseFloat(newFormValues.cost) *
            (1 + wholesomePercent)
          ).toFixed(2)
        }
        if (discountPercent) {
          newFormValues.price_discount = (
            parseFloat(newFormValues.cost) *
            (1 + discountPercent)
          ).toFixed(2)
        }
      }
    }

    setFormValues(newFormValues)
  }

  const handleSelectChangeBrand = (value) => {
    setMarcaProducto(value)
  }

  const handleSelectChangeCategories = (values) => {
    setCategoriasProducto(values)
  }

  const handleInputImgChange = async (e) => {
    let errorValidation = ''
    let file = e.target.files[0]

    if (file) {
      try {
        const options = {
          maxSizeMB: 1, // máximo 1MB
          maxWidthOrHeight: 1280, // máximo 1280px de ancho o alto
          useWebWorker: true,
        }
        const compressedFile = await imageCompression(file, options)
        const objectUrl = URL.createObjectURL(compressedFile)
        setTempImagenes([...tempImagenes, objectUrl])
        setTempImagenesData([...tempImagenesData, compressedFile])
      } catch (error) {
        errorValidation = 'Error al comprimir la imagen'
      }
    }

    setState({
      ...state,
      errImg: errorValidation,
    })

    e.target.value = ''
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
                price_type,
                price_discount,
                price_wholesome,
                cost,
                price_percent,
                wholesome_percent,
                discount_percent,
                cost_usd,
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
                price_type,
                price_discount,
                price_wholesome,
                cost,
                price_percent,
                wholesome_percent,
                discount_percent,
                cost_usd,
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
      price_percent: false,
      discount_percent: false,
      wholesome_percent: false,
      cost_usd: false,
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
    if (isNaN(price_percent)) {
      invalid.price_percent = true
      valid = false
    }
    if (isNaN(discount_percent)) {
      invalid.discount_percent = true
      valid = false
    }
    if (isNaN(wholesome_percent)) {
      invalid.wholesome_percent = true
      valid = false
    }
    if (isNaN(cost_usd)) {
      invalid.cost_usd = true
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
      errPriceDiscount: invalid.price_discount,
      errPriceWholesome: invalid.price_wholesome,
      errCost: invalid.cost,
      errPricePercent: invalid.price_percent,
      errDiscountPercent: invalid.discount_percent,
      errWholesomePercent: invalid.wholesome_percent,
      errCostUsd: invalid.cost_usd,
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
    errPriceDiscount,
    errPriceWholesome,
    errCost,
    errPricePercent,
    errDiscountPercent,
    errWholesomePercent,
    errCostUsd,
    errCategories,
    errBrand,
  } = state
  const {
    id,
    name,
    description,
    code,
    price,
    price_discount,
    price_wholesome,
    cost,
    price_type,
    price_percent,
    wholesome_percent,
    discount_percent,
    cost_usd,
  } = formValues
  const tipoCambio = params[3]?.value || 6.96

  const CloseModal = () => {
    dispatch(uiCloseModal())
  }

  return (
    <CModal visible={modalOpen} onClose={CloseModal} backdrop="static" size="xl">
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
            <CCol md="4">
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
            <CCol md="8">
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
            <CCol md="12">
              <CFormTextarea
                value={description === null ? '' : description}
                label="Descripción"
                onChange={handleInputChange}
                name="description"
                rows="1"
              />
            </CCol>
            {/* <CCol md="4" className="mt-5">
              <CFormSwitch
                label="Habilitar lista de precios"
                name="price_type"
                onChange={handleInputChange}
                size="lg"
                checked={price_type == 1}
                disabled
              />
            </CCol> */}
            <CCol md="4">
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
            <CCol md="8">
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
            <CCol md="12" style={{ borderTop: '1px dashed #cecece' }} className="my-2"></CCol>
            <CCol md="4">
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
            <CCol md="4">
              <CFormInput
                type="number"
                label="Costo USD"
                name="cost_usd"
                value={cost_usd || 0}
                onChange={handleInputChange}
                feedbackInvalid="este campo debe ser un número"
                invalid={errCostUsd}
              />
            </CCol>
            <CCol md="4" className="pt-4">
              <CAlert color="primary" className="m-0 p-2">
                Tipo de Cambio: <b>{tipoCambio}</b>{' '}
                <CAlertLink href="#/parametros">
                  <CIcon icon={cilPen} />
                </CAlertLink>
              </CAlert>
            </CCol>
            <CCol md="4">
              <CFormLabel htmlFor="price" className="col-sm-12 col-form-label">
                Precio
              </CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="number"
                  name="price"
                  value={price || 0}
                  onChange={handleInputChange}
                  feedbackInvalid="este campo debe ser un número"
                  invalid={errPrice}
                />
                <CInputGroupText>Bs</CInputGroupText>
                <CFormInput
                  type="number"
                  name="price_percent"
                  value={price_percent || 0}
                  onChange={handleInputChange}
                  feedbackInvalid="este campo debe ser menor o igual a 1"
                  invalid={errPricePercent}
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
            </CCol>
            <CCol md="4">
              <CFormLabel htmlFor="price_discount" className="col-sm-12 col-form-label">
                Precio con descuento
              </CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="number"
                  name="price_discount"
                  value={price_discount || 0}
                  onChange={handleInputChange}
                  feedbackInvalid="este campo debe ser un número"
                  invalid={errPriceDiscount}
                />
                <CInputGroupText>Bs</CInputGroupText>
                <CFormInput
                  type="number"
                  name="discount_percent"
                  value={discount_percent || 0}
                  onChange={handleInputChange}
                  feedbackInvalid="este campo debe ser menor o igual a 1"
                  invalid={errDiscountPercent}
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
            </CCol>
            <CCol md="4">
              <CFormLabel htmlFor="price_wholesome" className="col-sm-12 col-form-label">
                Precio por mayor
              </CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="number"
                  name="price_wholesome"
                  value={price_wholesome || 0}
                  onChange={handleInputChange}
                  feedbackInvalid="este campo debe ser un número"
                  invalid={errPriceWholesome}
                />
                <CInputGroupText>Bs</CInputGroupText>
                <CFormInput
                  type="number"
                  name="wholesome_percent"
                  value={wholesome_percent || 0}
                  onChange={handleInputChange}
                  feedbackInvalid="este campo debe ser menor o igual a 1"
                  invalid={errWholesomePercent}
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
            </CCol>
            <CCol md="12" style={{ borderTop: '1px dashed #cecece' }} className="my-2"></CCol>
          </CRow>
          <CRow>
            <CCol xs="12" md="3">
              <div className="d-grid gap-2">
                <label className="btn btn-outline-primary btn-block">
                  Agregar imágenes <CIcon icon={cilCamera} /> ó <CIcon icon={cilImagePlus} />
                  <input
                    name="image"
                    value={imagen}
                    type="file"
                    onChange={handleInputImgChange}
                    style={{ display: 'none' }}
                  />
                </label>
                <span className="text-danger small">{errImg}</span>
              </div>
            </CCol>
            <CCol xs="12" md="9">
              <CFormLabel>Imágenes del producto</CFormLabel>
              <CRow>
                {imagenes.map((img) => (
                  <CCol key={img.id} xs="3">
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
                  <CCol key={i} xs="3">
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
