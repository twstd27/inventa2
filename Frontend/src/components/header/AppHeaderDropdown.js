import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useAuthStore } from '../../stores/useAuthStore'

import avatar from './../../assets/images/avatars/default.png'

const AppHeaderDropdown = () => {
  const { usuario, startLogout } = useAuthStore()

  const handleLogout = () => {
    startLogout()
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 px-0 d-flex flex-row" caret={false}>
        <span className="pt-2 mx-2">Bienvenido, {usuario.name}</span>
        <CAvatar src={avatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {/* <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Cuenta</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Perfil
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Configuraciones
        </CDropdownItem>
        <CDropdownDivider /> */}
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
