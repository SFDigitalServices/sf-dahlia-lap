import React from 'react'

import { map } from 'lodash'
import ExpandableTable from '~/components/molecules/ExpandableTable'

const { ExpanderButton } = ExpandableTable

const columns = [
  { content: '' },
  { content: 'Preference Name' },
  { content: 'Person who claimed' },
  { content: 'Preference Rank' },
  { content: 'Type of proof' },
  { content: 'Status' },
  { content: 'Actions' }
]

const Icon = ({status}) => {
  if (status === "Invalid") {
    return <Icon type="close" size="medium" alert />
  } else {
    return <Icon type="close" size="check" success />
  }
}

// <Icon status={preference.lottery_status} />,
const buildRow = (preference) => {
  return [
    preference.preference_name,
    preference.person_who_claimed_name,
    preference.preference_lottery_rank,
    preference.type_of_proof,
    preference.post_lottery_validation
  ]
}

const ExpandedPanel = ({ onClose }) => {
  return (
    <div className="app-editable expand-wide scrollable-table-nested">
      <div>Hello</div>
      <br/>
      <button type='button' className="button" onClick={(e) => (onClose())}>Close</button>
    </div>
  )
}

const ExpanderAction = (row, expanded, expandedRowToggler) => {
  return <ExpanderButton onClick={expandedRowToggler}/>
}

const PreferencesTable = ({preferences}) => {
  const rows = map(preferences, buildRow)

  return (<ExpandableTable
            columns={columns}
            rows={rows}
            expanderRenderer={ExpanderAction}
            expandedRowRenderer={(row, toggle) => <ExpandedPanel onClose={toggle} /> }
          />)
  // return null
}

export default PreferencesTable
