import React from 'react'

const Dropdown = ({ text }) => {
  return (
    <button className="tiny button dropdown-button has-icon--right text-align-left">
      <span class="ui-icon ui-small" aria-hidden="true">
        <svg>
          <use xlinkHref="#i-arrow-down"></use>
        </svg>
      </span>
      {text}
    </button>
  )
}

export default Dropdown