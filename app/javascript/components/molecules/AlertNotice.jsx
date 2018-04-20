import React from 'react'

const AlertNotice = ({ title, content }) => {
  return (
    <div class="alert-notice alert">
      <p class="t-tiny c-alert margin-bottom">
        {title}
      </p>
      <p class="t-tiny c-steel margin-bottom">{content}</p>
    </div>
  )
}

export default AlertNotice