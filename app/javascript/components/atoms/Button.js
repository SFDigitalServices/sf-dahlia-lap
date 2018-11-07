import React from 'react'
import classNames from 'classnames'

const Button = ({ text, small, tiny, tertiary, ...rest }) => {
  const btnClassNames = classNames('button', {
    'small': small,
    'tertiary': tertiary,
    'tiny': tiny
  })
  return (
    <button className={btnClassNames} {...rest}>{text}</button>
  )
}

export default Button
