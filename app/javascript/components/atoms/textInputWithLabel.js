import React from 'react'

const textInputWithLabel = ({ label, id, name, placeholder, describeId, note }) => {
  return (
    <label for={for} className="">{label}</label>
    <input type="text" id={id} name={name} placeholder={placeholder} aria-describedby={describeId}>
    <span class="form-note shift-up" id={describeId}>{note}</span>
  )
}

export default textInputWithLabel
