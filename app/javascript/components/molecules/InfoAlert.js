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

const InfoAlert = ({ message, onCloseClick, closeType }) => {
  const classes = classNames({
    'info-alert': true,
    row: true,
    'full-width': true,
    'inner--3x': true
  })

  const closeLink = getCloseLink(closeType, onCloseClick)

  return (
    <div className={classes}>
      <div data-info className='info-alert-inner'>
        {closeLink}
        <span className='info-alert-icon ui-icon ui-medium'>
          <svg>
            <use xlinkHref='#i-hour-glass' />
          </svg>
        </span>
        <p className='info-alert-body'>{message}</p>
      </div>
    </div>
  )
}

export default InfoAlert
