import React from 'react'
import FormGroupTextInput from '../atoms/FormGroupTextInput'

const FormGridRow = ({ label, id, name, placeholder, describeId, note, error }) => {
  return (
    <div className='form-grid row expand padding-bottom'>
      <div className='form-grid_item small-12 medium-6 large-3 column'>
        <FormGroupTextInput label={label} id={id} name={name} placeholder={placeholder} describeId={describeId} note={note} error={error} />
      </div>
    </div>
  )
}

export default FormGridRow
