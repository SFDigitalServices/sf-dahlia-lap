import React from 'react'
import FormGridRow from '../molecules/FormGridRow'

const EditablePanel = ({ label, id, name, placeholder, describeId, note, error }) => {
  return (
    <div class="app-editable expand-wide scrollable-table-nested">
      <FormGridRow label={label} id={id} name={name} placeholder={placeholder} describeId={describeId} note={note} error={error} />
    </div>
  )
}

export default EditablePanel