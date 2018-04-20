import React from 'react'

const AlertBox = ({ message }) => {
  return (
    <div data-alert className="alert-box alert">
      <p class="alert-body">
        {message}
      </p>
      <a href="#" className="close ">&times;</a>
    </div>
  )
}

export default AlertBox