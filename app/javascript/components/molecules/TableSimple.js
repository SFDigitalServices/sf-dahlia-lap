import React from 'react'

const TableSimple = ({ header, value, headerB, valueB }) => {
  return (
    <table className='td-light td-plain th-plain' role='grid'>
      <thead>
        <tr>
          <th scope='col'>
            {header}
          </th>
          <th scope='col' className='text-right'>
            {headerB}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td scope='row'>
            {value}
          </td>
          <td className='text-right'>
            {valueB}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default TableSimple
