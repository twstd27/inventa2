import React from 'react'
import { CToast, CToastBody, CToaster, CToastClose } from '@coreui/react'
import { useUIStore } from '../stores/useUIStore'

const GlobalToaster = () => {
  const toasts = useUIStore((s) => s.toasts)
  const removeToast = useUIStore((s) => s.removeToast)

  return (
    <CToaster placement="bottom-end" className="p-3">
      {toasts.map((t) => (
        <CToast
          key={t.id}
          visible
          color={t.color}
          onClose={() => removeToast(t.id)}
          autohide={false}
        >
          <CToastBody className="d-flex justify-content-between align-items-center">
            {t.message}
            <CToastClose className="ms-2" onClick={() => removeToast(t.id)} />
          </CToastBody>
        </CToast>
      ))}
    </CToaster>
  )
}

export default GlobalToaster
