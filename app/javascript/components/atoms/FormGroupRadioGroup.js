import React from 'react'

const FormGroupRadioGroup = ({ label, id, name, value }) => {
  return (
    <div className='form-group'>
      <label htmlFor={name} className=''>{label}</label>
      <div className='radio-group-inline'>
        <p className='radio-inline'>
          <input type='radio' name={name} value={value} id={id} />
          <label className='radio-inline_label' htmlFor={id}>{value}</label>
        </p>
      </div>
    </div>
  )
}

export default FormGroupRadioGroup
