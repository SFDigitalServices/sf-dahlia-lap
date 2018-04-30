import React from 'react'
import classNames from 'classnames'

const AlertBox = ({ message, invert, noMarging }) => {
  const alertClass = classNames({
    'alert-box': true,
    alert: true,
    invert: !!invert,
    'no-margin': !!noMarging
  })

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
      <a href="#" className="close ">&times;</a>
    </div>
  )
}

export default AlertBox
