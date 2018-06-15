import React from 'react'

import IndexTable from '../../IndexTable'
import TableLayout from '../../layouts/TableLayout'

import mapProps from '~/utils/mapProps'

const FlaggedApplicationsIndexTable = ({ results, fields }) => {
  return <IndexTable
          results={results}
          fields={fields}
          links={['View Flagged Applications']} />
}

const FlaggedApplicationsIndexPage = ({title, results, fields}) => {
  return (
    <TableLayout pageHeader={{title: title}}>
      <FlaggedApplicationsIndexTable results={results} fields={fields} />
    </TableLayout>
  )
}

const mapProperties = ({title, results, fields }) => {
  return {
    title,
    results, // TODO: map here
    fields
  }
}

export default mapProps(mapProperties)(FlaggedApplicationsIndexPage)
