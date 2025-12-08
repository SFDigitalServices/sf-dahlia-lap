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

const InfoAlert = ({ icon, message, onCloseClick, closeType, classes = [] }) => {
  const defaultClasses = {
    'info-alert': true,
    'full-width': true,
    'inner--3x': true
  }
  classes.forEach((c) => {
    defaultClasses[c] = true
  })
  const combinedClasses = classNames(defaultClasses)

  const closeLink = getCloseLink(closeType, onCloseClick)

  return (
    <div className={combinedClasses}>
      <div data-info className='info-alert-inner'>
        {closeLink}
        <span className='info-alert-icon ui-icon ui-medium'>
          <svg>
            <use xlinkHref={`#${icon}`} />
          </svg>
        </span>
        <p className='info-alert-body'>{message}</p>
      </div>
    </div>
  )
}

export default InfoAlert
