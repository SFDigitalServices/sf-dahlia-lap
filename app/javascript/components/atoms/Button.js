import React from 'react'
import classNames from 'classnames'

const Button = ({ text, tiny, tertiary, ...rest }) => {
  const btnClassNames = classNames('button', {
    'tiny': tiny,
    'tertiary': tertiary
  })
  return (
    <button className={btnClassNames} {...rest}>{text}</button>
  )
}

export default Button
