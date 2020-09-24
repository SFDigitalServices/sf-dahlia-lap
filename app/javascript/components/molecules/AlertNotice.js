import React from 'react'

const AlertNotice = ({ title, content, invert, dismiss }) => {
  if (dismiss) {
    return null
  }

  const invertClass = invert ? 'invert' : ''
  return (
    <div className={`alert-notice alert ${invertClass}`}>
      <p className='t-tiny c-alert margin-bottom'>{title}</p>
      <p className='t-tiny c-steel margin-bottom'>{content}</p>
    </div>
  )
}

export default AlertNotice
