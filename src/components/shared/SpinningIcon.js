import React from 'react'
import { Loader } from 'lucide-react'

export default function SpinningIcon({
  icon: Icon = Loader,
  size = 24,
  color = 'currentColor',
  speed = 'normal',
  className = '',
}) {
  const spinKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `

  const getAnimationDuration = (speed) => {
    switch (speed) {
      case 'slow':
        return '3s'
      case 'fast':
        return '0.5s'
      default:
        return '1s'
    }
  }

  const iconStyle = {
    animation: `spin ${getAnimationDuration(speed)} linear infinite`,
  }

  return (
    <>
      <style>{spinKeyframes}</style>
      <Icon size={size} color={color} style={iconStyle} className={className} />
    </>
  )
}
