import React from 'react'

const DropdownMenuItem = ({ value, label, selected, onChange }) => {
  let liClassName = 'dropdown-menu_item'
  if (selected)
    liClassName += ' is-selected'

  const onChangeHandler = () => {
    onChange && onChange(value, label)
  }

  const onKeyPressHandler = (e) => {
    onChangeHandler()
    e.preventDefault()
  }

  return (
    <li className={liClassName} role="option" aria-selected={selected}>
      <a tabIndex="0" onKeyPress={onKeyPressHandler} onClick={onChangeHandler}>{label}</a>
    </li>
  )
}

export default DropdownMenuItem
