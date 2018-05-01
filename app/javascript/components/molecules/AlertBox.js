import React from 'react'
import classNames from 'classnames'

const getCloseLink = (type, onCloseClick) => {
  if (type == 'text')
    return <a className="close text" onClick={onCloseClick}>Close</a>
  else
    return <a className="close" onClick={onCloseClick}>&times;</a>
}

const AlertBox = ({ message, invert, noMargin, onCloseClick, dismiss, closeType }) => {
  if (dismiss)
    return null

  const alertClass = classNames({
    'alert-box': true,
    alert: true,
    invert: !!invert,
    'no-margin': !!noMargin
  })

  const closeLink = getCloseLink(closeType, onCloseClick)

  return (
    <div data-alert className={alertClass}>
      <span className="alert-icon ui-icon ui-medium">
        <svg>
          <use xlinkHref="#i-warning"></use>
        </svg>
      </span>
      <p class="alert-body">
        {message}
      </p>
      { closeLink }
    </div>
  )
}

export default AlertBox
