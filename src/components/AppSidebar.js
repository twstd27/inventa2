import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'

import { toggleSidebar } from '../actions/layoutAction'

const AppSidebar = () => {
  const dispatch = useDispatch()

  //TODO: corregir error de doble click sobre toggleSidebar
  const unfoldable = useSelector((state) => state.sidebarUnfoldable) //TODO: ver que hace esta variable
  const sidebarShow = useSelector((state) => state.layout.sidebarShow)

  const handleToggleSidebar = (visible) => {
    dispatch(toggleSidebar(visible))
  }

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
          <img width="100" src="./logo.jpg" alt="logo" />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => {
            handleToggleSidebar(false)
          }}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
