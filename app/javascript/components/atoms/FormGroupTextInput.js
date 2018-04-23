import React from 'react'

const FormGroupTextInput = ({ label, id, name, placeholder, describeId, note }) => {
  return (
    <div className="form-group">
      <label for={name} className="">{label}</label>
      <input type="text" id={id} name={name} placeholder={placeholder} aria-describedby={describeId}/>
      <span class="form-note shift-up" id={describeId}>{note}</span>
    </div>
  )
}

export default FormGroupTextInput
