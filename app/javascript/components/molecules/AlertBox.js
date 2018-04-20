import React from 'react'

const AlertBox = ({ message }) => {
  return (
    <div data-alert class="alert-box alert">
      <p class="alert-body">
        {message}
      </p>
      <a href="#" class="close ">&times;</a>
    </div>
  )
}

export default AlertBox