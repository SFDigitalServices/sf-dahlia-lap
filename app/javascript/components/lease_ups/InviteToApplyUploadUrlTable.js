import React from 'react'

import { map } from 'lodash'

import PreferenceRankCell from 'components/lease_ups/application_page/PreferenceRankCell'
import validate from 'utils/form/validations'

import TextInputCell from './application_page/TextInputCell'
import { getCellWidth, textCell } from './LeaseUpApplicationsTable'
import { buildRowData } from './LeaseUpApplicationsTableContainer'

const InviteToApplyUploadUrlTable = ({ getSelectedData }) => {
  const enhancedDataSet = map(getSelectedData(), buildRowData)
  const columns = [
    {
      Header: 'Rank',
      accessor: 'rankOrder',
      headerClassName: 'non-resizable',
      width: getCellWidth(60),
      // only show the preference validation if the listing type has preferences
      // first come first served listings do not have preferences
      Cell: (cell) => <PreferenceRankCell preferenceRank={cell.original.preference_rank} />
    },
    {
      Header: 'Application',
      accessor: 'application_number',
      headerClassName: 'non-resizable',
      width: getCellWidth(125),
      Cell: textCell
    },
    {
      Header: 'Name',
      accessor: 'fullName',
      headerClassName: 'non-resizable',
      minWidth: getCellWidth(200),
      Cell: textCell
    },
    {
      Header: 'Document upload URL',
      accessor: 'upload_url',
      headerClassName: 'non-resizable',
      minWidth: getCellWidth(200),
      Cell: (cell) => {
        return (
          <TextInputCell
            applicationId={cell.original.application_id}
            validation={validate.isValidUrl(
              'Not a valid web address.  Make sure it starts with https:// or http:// and has no spaces.'
            )}
          />
        )
        // return textCell
        // return <input id={'foo-input'} type={'text'} maxLength={255} disabled={false} />
      }
    }
  ]

  const getColumnWidth = (col) => {
    return col.width ? col.width : col.minWidth
  }

  const generateHeaderRow = () => {
    return (
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th
              style={{
                width: getColumnWidth(col),
                'max-width': getColumnWidth(col)
              }}
              key={idx}
            >
              {col.Header}
            </th>
          ))}
        </tr>
      </thead>
    )
  }

  const generateTableBody = () => {
    return (
      <tbody
        style={{
          'overflow-y': 'auto',
          maxHeight: '300px'
        }}
      >
        {enhancedDataSet.map((row, rowIdx) => (
          <tr
            className={rowIdx % 2 === 0 ? '-even' : '-odd'}
            key={rowIdx}
            style={{
              'min-height': '100px'
            }}
          >
            {columns.map((col, colIdx) => (
              <td
                key={colIdx}
                style={{
                  width: getColumnWidth(col),
                  'max-width': getColumnWidth(col)
                }}
              >
                {col.Cell === textCell
                  ? col.Cell({ value: row[col.accessor] })
                  : col.Cell({ original: row })}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    )
  }

  return (
    <table className='i2a-selected-apps-table'>
      {generateHeaderRow()}
      {generateTableBody()}
    </table>
  )
}

export default InviteToApplyUploadUrlTable
