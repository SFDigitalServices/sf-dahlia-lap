import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const Icon = ({
  icon,
  size = 'default',
  alert = false,
  success = false,
  uiIconClassName = 'ui-icon'
}) => {
  const spanClassName = classNames(uiIconClassName, {
    [`ui-${size}`]: size !== 'default',
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

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['default', 'small', 'medium', 'tiny']),
  alert: PropTypes.bool,
  success: PropTypes.bool,
  uiIconClassName: PropTypes.string
}

export default Icon
