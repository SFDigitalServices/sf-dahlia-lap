import React from 'react'

import classNames from 'classnames'

const Icon = ({ icon, size = 'small', alert, success }) => {
  const spanClassName = classNames('ui-icon', `ui-${size}`, {
    'i-alert': alert,
    'i-success': success
  })

  return (
    <span className={spanClassName}>
      <svg>
        <use xlinkHref={`#i-${icon}`} />
      </svg>
    </span>
  )
}

export default Icon
