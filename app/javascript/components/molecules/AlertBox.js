import React from 'react'

const AlertBox = ({ message }) => {
  return (
    <div data-alert className="alert-box alert invert">
      <span className="alert-icon ui-icon ui-medium">
        <svg>
          <use xlinkHref="#i-warning"></use>
        </svg>
      </span>
      <p className="alert-body">
        {message}
      </p>
      <a href="#" className="close ">&times;</a>
    </div>
  )
}

export default AlertBox