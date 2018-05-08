import React from 'react'
import TableExpandable from '../molecules/TableExpandable'

const FormGridTable = ({ header, value, headerB, valueB, label, id, name, placeholder, describeId, note, error }) => {
  return (
    <div className="form-grid row expand padding-bottom">
      <TableExpandable header={header} value={value} headerB={headerB} valueB={valueB} label={label} id={id} name={name} placeholder={placeholder} describeId={describeId} note={note} error={error} />
    </div>
  )
}

export default FormGridTable
