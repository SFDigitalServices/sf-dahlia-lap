import React from 'react'

class ExpandableTable extends React.Component {
  render() {
    const { columns, data } = this.props

    return (
      <table className="td-light td-plain th-plain" role="grid">
        <thead>
          <tr>
            {columns.map((column) => (
              <th scope="col" className="{column.classes ? column.classes.join(' ') : ''}">
                {column.content}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            // row = [
            //   'dthp',
            //   'bob',
            //   'smith',
            //   () => {
            //
            //   }
            // ]
            //render for row
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

            // always call expandedRowRenderer(row)
            //   if row[indexOfExpander]
            // render for datum.expandableRow
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
          ))}
        </tbody>
      </table>
    )
  }
}


export default ExpandableTable
