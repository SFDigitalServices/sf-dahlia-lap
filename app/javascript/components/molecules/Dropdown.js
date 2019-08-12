import React, { useEffect, useState, useRef } from 'react'
import { find } from 'lodash'
import classNames from 'classnames'

import DropdownMenu from '../molecules/DropdownMenu'
import DropdownMenuMultiSelect from '../molecules/DropdownMenuMultiSelect'

const dropdownStyle = { top: 40, left: 0 }

const Dropdown = ({
  prompt,
  items,
  value,
  styles,
  buttonClasses,
  wrapperClasses,
  menuClasses = [],
  disabled,
  multiple,
  onChange
}) => {
  const [expanded, setExpanded] = useState(false)
  const wrapperRef = useRef(null)
  const buttonRef = useRef(null)
  const DropdownComponent = multiple ? DropdownMenuMultiSelect : DropdownMenu

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', onEscapeHandler)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', onEscapeHandler)
    }
  }, [])

  const toggleExpand = (e) => {
    setExpanded(!expanded)
    // We need this to avoid triggering the collapse function from Foundation
    e.stopPropagation()
  }

  const componentClickHandler = (e) => {
    // We want to hide the dropdown menu only when we click in the component but outside the menu
    if (wrapperRef === e.target) { setExpanded(false) }
  }

  const onChangeHandler = (value, label) => {
    if (!multiple) {
      setExpanded(false)
      buttonRef.focus()
    }
    onChange && onChange(value, label)
  }

  const handleClickOutside = (event) => {
    if (wrapperRef && !wrapperRef.current.contains(event.target)) {
      setExpanded(false)
    }
  }

  const onEscapeHandler = (event) => {
    if (event.keyCode === 27) { setExpanded(false) }
  }

  const selectedItem = find(items, { value })

  return (
    <div
      className={classNames('dropdown', wrapperClasses)}
      onClick={componentClickHandler}
      ref={wrapperRef}
      style={styles}>
      <button
        aria-expanded={expanded ? 'true' : 'false'}
        onClick={toggleExpand}
        ref={buttonRef}
        className={`button dropdown-button has-icon--right text-align-left ${buttonClasses ? buttonClasses.join(' ') : ''}`}
        type='button'
        disabled={disabled}>
        <span className='ui-icon ui-small'>
          <svg>
            <use xlinkHref='#i-arrow-down' />
          </svg>
        </span>
        {selectedItem ? selectedItem.label : prompt}
      </button>
      <div className='dropdown-menu-wrapper' aria-hidden={expanded ? 'false' : 'true'} role='menu'>
        {expanded && (
          <DropdownComponent
            style={dropdownStyle}
            onChange={onChangeHandler}
            values={value}
            items={items}
            classes={menuClasses} />
        )}
      </div>
    </div>
  )
}

export default Dropdown
