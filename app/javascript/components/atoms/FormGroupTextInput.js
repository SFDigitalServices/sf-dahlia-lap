import React from 'react'

const FormGroupTextInput = ({ label, id, name, placeholder, describeId, note, error }) => {
  return (
    <div className='form-group error'>
      <label htmlFor={name} className=''>
        {label}
      </label>
      <input
        type='text'
        id={id}
        className='error'
        name={name}
        placeholder={placeholder}
        aria-describedby={describeId}
      />
      <small className='error' id={id}>
        {error}
      </small>
      <span className='form-note shift-up' id={describeId}>
        {note}
      </span>
    </div>
  )
}

export default FormGroupTextInput
