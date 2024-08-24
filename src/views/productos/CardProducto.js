import React, {useState} from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol
} from "@coreui/react";
import {DISK} from "../../types/types";

export const CardProducto = (props) => {
  const [state] = useState({producto: props.producto});
  const {producto:product} = state;

  return(
    <CCol xs="12" sm="6" md="4">
      <CCard>
        <CCardHeader onClick={() => {props.modal(product)}} className="p-0 cursor-zoom-in">
          {
            product?.images.length > 0 ? (
              <img className="d-block w-100" src={`${DISK}/${product.images[0].name}`} alt="slide"/>
            ) : (
              <img width="100%" src={'./img/product_default.png'} alt="img"/>
            )
          }
        </CCardHeader>
        <CCardBody onClick={() => {props.agregar(product)}} className="cursor-pointer clickable-div">
          <h6 className="text-primary">{product?.code}</h6>
          <h6 className="text-primary font-weight-bold">{product?.name}</h6>
          <h6 className="text-success">
            <span className="text-dark">Precio:</span> BOB <span className="font-weight-bold">{product?.price}</span>
          </h6>
          <h6 className="text-dark">Cantidad: <span className={`text-primary font-weight-bold' ${(product.quantity === '0.00') ? 'text-danger' : ''}`}>{product.quantity}</span></h6>
        </CCardBody>
      </CCard>
    </CCol>
  )
}
