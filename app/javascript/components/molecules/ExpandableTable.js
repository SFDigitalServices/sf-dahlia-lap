import React from 'react'

import classNames from 'classnames'
import { kebabCase } from 'lodash'

import formUtils from 'utils/formUtils'

const ExpandableTableRow = ({
  row,
  idx,
  rowKeyIndex,
  numColumns,
  renderRow,
  renderExpanderButton,
  original,
  expanded
}) => {
  const css = row[1].content.includes('Veterans') ? 'combine' : 'break'

  const cells = row.map((datum, j) => (
    <td className={datum.classes ? datum.classes.join(' ').concat(` ${css}`) : `${css}`} key={j}>
      {datum.formatType === 'currency' ? formUtils.formatPrice(datum.content) : datum.content}
    </td>
  ))

  const rowId = rowKeyIndex ? kebabCase(row[rowKeyIndex].content) : null

  return (
    <>
      <tr className={`tr-expand`} aria-expanded={expanded} id={rowId ? `${rowId}-row` : null}>
        {cells}
        <td className={css} key='expander'>
          {renderExpanderButton(idx, row, original, expanded)}
        </td>
      </tr>
      <tr
        className='tr-expand-content'
        aria-hidden={!expanded}
        id={rowId ? `${rowId}-panel` : null}
      >
        <td colSpan={numColumns} className='td-expand-nested no-padding break'>
          {renderRow(idx, row, original)}
        </td>
      </tr>
    </>
  )
}

/**
 * A rewrite of ExpandableTable that uses props to determine whether the rows are expanded or not.
 * This allows us to write components in a more idiomatic way.
 */
const ExpandableTable = ({
  columns,
  rows,
  rowKeyIndex,
  renderExpanderButton,
  renderRow,
  originals,
  classes,
  expandedRowIndices = new Set()
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
          renderExpanderButton={renderExpanderButton}
          renderRow={renderRow}
          expanded={expandedRowIndices.has(i)}
        />
      ))}
    </tbody>
  </table>
)

export const ExpanderButton = ({ onClick, label = 'Expand', id }) => (
  <button type='button' className='button button-link action-link' onClick={onClick} id={id}>
    {label}
  </button>
)

export default ExpandableTable
