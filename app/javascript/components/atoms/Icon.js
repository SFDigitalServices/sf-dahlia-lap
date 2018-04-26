import React from 'react'

const Icon = ({ icon }) => {
  return (
    <span className="ui-icon ui-small">
      <svg>
        <use xlinkHref={icon}></use>
      </svg>
    </span>
  )
}

export default Icon
