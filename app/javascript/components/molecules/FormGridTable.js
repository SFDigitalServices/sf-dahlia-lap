import React from 'react'
import ExpandableTable from '../molecules/ExpandableTable'

const FormGridTable = ({ header, value, headerB, valueB, label, id, name, placeholder, describeId, note, error }) => {
  return (
    <div className="form-grid row expand">
      <div className="small-12 column">
        <div className="scrollable-table-container">
          {/*<ExpandableTable header={header} value={value} headerB={headerB} valueB={valueB} label={label} id={id} name={name} placeholder={placeholder} describeId={describeId} note={note} error={error} /> */}
        </div>
      </div>
    </div>
  )
}

export default FormGridTable
