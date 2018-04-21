import React from 'react'

const AlertNotice = ({ title, content }) => {
  return (
    <div className="alert-notice alert">
      <p className="t-tiny c-alert margin-bottom">
        {title}
      </p>
      <p className="t-tiny c-steel margin-bottom">{content}</p>
    </div>
  )
}

export default AlertNotice