import React from 'react'

import { map } from 'lodash'
import ExpandableTable from '~/components/molecules/ExpandableTable'
import Icon from '~/components/atoms/Icon'

const { ExpanderButton } = ExpandableTable

const TableIcon = ({status}) => {
  if (status === "Invalid") {
    return <Icon icon="close" type="medium" alert />
  } else {
    return <Icon icon="check" type="medium" success />
  }
}

const columns = [
  { Header: '', accessor: 'post_lottery_validation', Cell: ({row}) => <TableIcon status={row.post_lottery_validation} />},
  { Header: 'Preference Name', accessor: 'preference_name'},
  { Header: 'Person who claimed', accessor: 'person_who_claimed_name' },
  { Header: 'Preference Rank', accessor: 'preference_lottery_rank' },
  { Header: 'Type of proof', accessor: 'type_of_proof' },
  { Header: 'Status', accessor: 'post_lottery_validation' },
  { Header: 'Actions' }
]

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
  return <ExpanderButton onClick={expandedRowToggler}/>
}

const PreferencesTable = ({preferences}) => {
  return (<ExpandableTable
            columns={columns}
            rows={preferences}
            expanderRenderer={ExpanderAction}
            expandedRowRenderer={(row, toggle) => <Expanded onClose={toggle} /> }
          />)
}

export default PreferencesTable
