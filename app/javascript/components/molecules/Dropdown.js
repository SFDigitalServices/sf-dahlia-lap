import React from 'react'
import dropdownMenu from '../molecules/dropdownMenu'

const Dropdown = ({ text, size }) => {
  return (
    <div class="dropdown">
      <button className={`${size} button dropdown-button has-icon--right text-align-left`}>
        <span class="ui-icon ui-small" aria-hidden="true">
          <svg>
            <use xlinkHref="#i-arrow-down"></use>
          </svg>
        </span>
        {text}
      </button>
      <dropdownMenu/>
    </div>
  )
}

export default Dropdown