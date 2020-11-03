import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { kebabCase } from 'lodash'

import formUtils from 'utils/formUtils'

const ExpandableTableRow = ({
  row,
  rowKeyIndex,
  numColumns,
  expanderRenderer,
  expandedRowRenderer,
  original,
  closeRow = false
}) => {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (closeRow) {
      setExpanded(false)
    }
  }, [closeRow])

  const toggleExpandedRow = () => setExpanded(!expanded)

  const cells = row.map((datum, j) => (
    <td className={datum.classes ? datum.classes.join(' ') : ''} key={j}>
      {datum.formatType === 'currency' ? formUtils.formatPrice(datum.content) : datum.content}
    </td>
  ))

  const rowId = rowKeyIndex ? kebabCase(row[rowKeyIndex].content) : null

  return (
    <>
      <tr className='tr-expand' aria-expanded={expanded} id={rowId ? `${rowId}-row` : null}>
        {cells}
        <td key='expander'>
          {expanderRenderer && expanderRenderer(row, expanded, toggleExpandedRow)}
        </td>
      </tr>
      <tr
        className='tr-expand-content'
        aria-hidden={!expanded}
        id={rowId ? `${rowId}-panel` : null}
      >
        <td colSpan={numColumns} className='td-expand-nested no-padding'>
          {expandedRowRenderer && expandedRowRenderer(row, toggleExpandedRow, original)}
        </td>
      </tr>
    </>
  )
}

const ExpandableTable = ({
  columns,
  rows,
  rowKeyIndex,
  expanderRenderer,
  expandedRowRenderer,
  originals,
  classes,
  closeAllRows
}) => (
  <table
    className={classNames('td-light td-plain th-plain', classes)}
    style={{ background: 'transparent' }}
    role='grid'
  >
    <thead>
      <tr>
        {columns.map((column, i) => (
          <th key={i} scope='col' className={column.classes ? column.classes.join(' ') : ''}>
            {column.content}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <ExpandableTableRow
          key={i}
          rowKeyIndex={rowKeyIndex} // index for element in row to use as a css id.
          idx={i}
          original={originals && originals[i]}
          row={row}
          numColumns={columns.length}
          expanderRenderer={expanderRenderer}
          expandedRowRenderer={expandedRowRenderer}
          closeRow={closeAllRows}
        />
      ))}
    </tbody>
  </table>
)

ExpandableTable.ExpanderButton = ({ onClick, label = 'Expand', id }) => (
  <button type='button' className='button button-link action-link' onClick={onClick} id={id}>
    {label}
  </button>
)

export default ExpandableTable
