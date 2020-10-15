import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

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

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'tiny']),
  alert: PropTypes.bool,
  success: PropTypes.bool
}

Icon.defaultProps = {
  size: 'small'
}

export default Icon
