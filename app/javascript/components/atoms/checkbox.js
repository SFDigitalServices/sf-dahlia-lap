import React from 'react'

const checkbox = ({ name, text }) => {
  return (
    <div class="checkbox">
      <input id="{name}" type="checkbox" name="{name}" tab-index="1" />
      <label for="{name}">{text}</label>
    </div>
  )
}

export default checkbox