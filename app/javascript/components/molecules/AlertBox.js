import React from 'react'
import classNames from 'classnames'

const getCloseLink = (type, onCloseClick) => {
  if (type === 'text')
    return <button type='button' className="button button-link close text" onClick={onCloseClick}>Close</button>
  else
    return <button type='button' className="button button-link close" onClick={onCloseClick}>&times;</button>
}

const AlertBox = ({ message, invert, noMargin, onCloseClick, dismiss, closeType }) => {
  //TODO: dismiss seems to be useless here, you can handle show or not showing this component from outside + callback, Fed
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
      <p className="alert-body">
        {message}
      </p>
      { closeLink }
    </div>
  )
}

export default AlertBox
