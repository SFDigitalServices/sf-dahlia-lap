import React from 'react'

const FormGroupTextValue = ({ label, id, name, tab, describeId, note, value }) => {
  return (
    <div className="form-group">
      <label for={name} className="">{label}</label>
      <div class="text-value" id={id} tabindex={tab} aria-describedby={describeId}>{value}</div>
      <span class="form-note shift-up" id={describeId}>{note}</span>
    </div>
  )
}

export default FormGroupTextValue
