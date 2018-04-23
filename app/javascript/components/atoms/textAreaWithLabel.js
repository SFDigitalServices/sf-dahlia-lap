import React from 'react'

const textAreaWithLabel = ({ label, id, name, placeholder, describeId, note, value }) => {
  return (
    <label for={for} className="">{label}</label>
    <textarea type="text" id={id} name={name} placeholder={placeholder} aria-describedby={describeId}>{value}</textarea>
    <span class="form-note shift-up" id={describeId}>{note}</span>
  )
}

export default textAreaWithLabel
