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
    return (
      <span class="ui-icon ui-medium i-alert">
        <svg>
          <use xlinkHref="#i-close"></use>
        </svg>
      </span>
    )
  } else {
    return (
      <span class="ui-icon ui-medium i-success">
        <svg>
          <use xlinkHref="#i-check"></use>
        </svg>
      </span>
    )
  }
}

const buildRow = (preference) => {
  return [
    <Icon status={preference.lottery_status} />,
    preference.name,
    preference.person_who_claimed_name,
    preference.preference_lottery_rank,
    preference.type_of_proof,
    preference.lottery_status
  ]
}

const Expanded = ({ onClose }) => {
  return (
    <div className="app-editable expand-wide scrollable-table-nested">
      <div>Hello</div>
      <br/>
      <button type='button' className="button" onClick={(e) => (onClose())}>Close</button>
    </div>
  )
}

const ExpanderAction = (row, expanded, expandedRowToggler) => {
  console.log(row)
  return <ExpanderButton onClick={expandedRowToggler}/>
}

const PreferencesTable = ({preferences}) => {
  const rows = map(preferences, buildRow)

  return (<ExpandableTable
            columns={columns}
            rows={rows}
            expanderRenderer={ExpanderAction}
            expandedRowRenderer={(row, toggle) => <Expanded onClose={toggle} /> }
          />)
}

export default PreferencesTable
