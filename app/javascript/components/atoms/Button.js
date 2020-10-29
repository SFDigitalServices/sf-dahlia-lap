import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const Button = ({
  children = null,
  classes = null,
  noBottomMargin = false,
  small = false,
  tertiary = false,
  text = null,
  tiny = false,
  type = 'button',
  ...rest
}) => {
  const btnClassNames = classNames(classes, 'button', {
    small: small,
    tertiary: tertiary,
    tiny: tiny,
    'margin-bottom-none': noBottomMargin
  })
  return (
    <button className={btnClassNames} type={type} {...rest}>
      {text || children}
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit']),
  noBottomMargin: PropTypes.bool,
  children: PropTypes.node
}

export default Button
