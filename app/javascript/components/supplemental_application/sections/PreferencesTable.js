import React from 'react'

import { map, reject } from 'lodash'
import Icon from '~/components/atoms/Icon'
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

const PreferenceIcon = ({status}) => {
  if (status === "Invalid") {
    return <Icon icon="close" size="medium" alert />
  } else {
    return <Icon icon="check" size="medium" success />
  }
}

const isCOPorDHCP = value => value.match(/COP|DTHP/)

const buildRow = (preference) => {
  return [
    <PreferenceIcon status={preference.post_lottery_validation} />,
    preference.preference_name,
    preference.person_who_claimed_name,
    preference.preference_lottery_rank,
    isCOPorDHCP(preference.preference_name) ? preference.certificate_number : preference.type_of_proof,
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
  return (!isCOPorDHCP(row[1]) &&
          <ExpanderButton onClick={expandedRowToggler}/>)
}

const onlyValid = (preferences) => {
  return reject(preferences, { lottery_status: 'Invalid for lottery' } )
}

const PreferencesTable = ({preferences}) => {
  const rows = map(onlyValid(preferences), buildRow)

  return (<ExpandableTable
            columns={columns}
            rows={rows}
            expanderRenderer={ExpanderAction}
            expandedRowRenderer={(row, toggle) => <ExpandedPanel onClose={toggle} /> }
          />)
}

export default PreferencesTable
