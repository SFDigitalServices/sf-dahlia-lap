import React from 'react'

import classNames from 'classnames'

const getCloseLink = (type, onCloseClick) => {
  if (type === 'text') {
    return (
      <button type='button' className='button button-link close text' onClick={onCloseClick}>
        Close
      </button>
    )
  } else {
    return (
      <button type='button' className='button button-link close' onClick={onCloseClick}>
        &times;
      </button>
    )
  }
}

const AlertBox = ({ message, invert, noMargin, onCloseClick, closeType }) => {
  const alertClass = classNames({
    'alert-box': true,
    alert: true,
    invert: !!invert,
    'no-margin': !!noMargin
  })

  const closeLink = getCloseLink(closeType, onCloseClick)

  return (
    <div data-alert className={alertClass}>
      <span className='alert-icon ui-icon ui-medium'>
        <svg>
          <use xlinkHref='#i-warning' />
        </svg>
      </span>
      <p className='alert-body'>{message}</p>
      {closeLink}
    </div>
  )
}

export default AlertBox
