import React from 'react'

const FormGroupTextArea = ({ label, id, name, placeholder, describeId, note, value }) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="">{label}</label>
      <textarea type="text" id={id} name={name} placeholder={placeholder} aria-describedby={describeId} value={value}></textarea>
      <span className="form-note shift-up" id={describeId}>{note}</span>
    </div>
  )
}

export default FormGroupTextArea
