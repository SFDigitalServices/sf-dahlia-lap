import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const Button = ({
  type,
  text,
  small,
  tiny,
  tertiary,
  noBottomMargin,
  classes,
  ...rest
}) => {
  const btnClassNames = classNames(
    classes,
    'button',
    {
      small: small,
      tertiary: tertiary,
      tiny: tiny,
      'margin-bottom-none': noBottomMargin
    }
  )
  return (
    <button
      className={btnClassNames}
      type={type}
      {...rest}
    >
      {text}
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit']),
  noBottomMargin: PropTypes.bool
}

Button.defaultProps = {
  type: 'button',
  noBottomMargin: false
}

export default Button
