import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config
import navigation from '../_nav'

import { toggleSidebar } from '../actions/layoutAction'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const [menu, setMenu] = useState(navigation)

  //TODO: corregir error de doble click sobre toggleSidebar
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.layout.sidebarShow)
  const { usuario } = useSelector((state) => state.auth)

  const handleToggleSidebar = (visible) => {
    dispatch(toggleSidebar(visible))
  }

  const menuPermisos = (nav, criteria) => {
    const values = criteria.map((item) => item.value)
    if (values[0] === 'todos') {
      setMenu(navigation)
      return
    }

    const auxMenu = nav
      .map((item) => {
        if (item.items) {
          // Filtrar los subitems
          const filteredItems = item.items.filter(
            (subItem) => subItem.to && values.some((value) => subItem.to.includes(value)),
          )
          if (filteredItems.length > 0) {
            // Retornar el grupo con los subitems filtrados
            return { ...item, items: filteredItems }
          }
          return null // Si no hay subitems que coincidan, excluir el grupo
        }
        // Retornar el item si coincide con el criterio
        return item.to && values.some((value) => item.to.includes(value)) ? item : null
      })
      .filter(Boolean) // Eliminar elementos nulos
    setMenu(auxMenu)
  }

  useEffect(() => {
    if (usuario) {
      menuPermisos(navigation, usuario.permissions)
    }
  }, [usuario])

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={() => {
        handleToggleSidebar(sidebarShow)
      }}
    >
      <CSidebarHeader className="border-bottom d-md-flex justify-content-md-center">
        <CSidebarBrand to="/dashboard">
          <img width="100" src="./logo.png" alt="logo" />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => {
            handleToggleSidebar(false)
          }}
        />
      </CSidebarHeader>
      <AppSidebarNav items={menu} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
