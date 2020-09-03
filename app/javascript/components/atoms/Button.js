import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const Button = ({ type, text, small, tiny, tertiary, classes, ...rest }) => {
  const btnClassNames = classNames('button', classes, {
    'small': small,
    'tertiary': tertiary,
    'tiny': tiny
  })
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
  type: PropTypes.oneOf(['button', 'submit'])
}

Button.defaultProps = {
  type: 'button'
}

export default Button
