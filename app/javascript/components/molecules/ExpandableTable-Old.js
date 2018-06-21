import React from 'react'
import EditablePanel from '../molecules/EditablePanel'

const ExpandableTable = ({ header, value, headerB, valueB, label, id, name, placeholder, describeId, note, error }) => {
  return (
    <table className="td-light td-plain th-plain" role="grid">
      <thead>
        <tr>
          <th scope="col">
            {header}
          </th>
          <th scope="col" className="text-right">
            {headerB}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="tr-expand is-expanded" aria-expanded="true">
          <td scope="row">
            {value}
          </td>
          <td className="text-right">
            <button className='button button-link action-link'>{valueB}</button>
          </td>
        </tr>
        <tr className="tr-expand-content is-expanded" aria-hidden="false">
          <td colSpan="7" className="td-expand-nested no-padding">
            <EditablePanel label={label} id={id} name={name} placeholder={placeholder} describeId={describeId} note={note} error={error} />
          </td>
        </tr>
      </tbody>
    </table>
  )
}


export default ExpandableTable
