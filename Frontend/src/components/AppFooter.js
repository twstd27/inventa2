import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div></div>
      <div className="ms-auto">
        <span className="me-1">Powered by Rx</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
