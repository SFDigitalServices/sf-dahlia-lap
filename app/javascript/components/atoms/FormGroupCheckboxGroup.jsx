import React from 'react'

const FormGroupCheckboxGroup = ({ label, id, name, value }) => {
  return (
    <div className="form-group">
      <label for={name} className="">{label}</label>
      <div className="checkbox-group">
        <div className="checkbox-block">
          <input type="checkbox" name={name} value={value} id={id}/>
          <label className="checkbox-block_label" for={id}>{value}</label>
        </div>
      </div>
    </div>
  )
}

export default FormGroupCheckboxGroup
