import React from 'react'

import { map, reject, filter, isEmpty } from 'lodash'
import Icon from '~/components/atoms/Icon'
import ExpandableTable from '~/components/molecules/ExpandableTable'

const { ExpanderButton } = ExpandableTable

/** Helpers **/

const isCOPorDHCP = value => value.match(/COP|DTHP/)

const getPreferenceName = ({ preference_name, individual_preference }) => {
  if (preference_name === 'Live or Work in San Francisco Preference') {
    if (individual_preference === 'Live in SF') {
      return "Live in San Francisco Preference"
    } else {
      return "Work in San Francisco Preference"
    }
  } else if (preference_name === 'Rent Burdened / Assisted Housing Preference') {
    if (individual_preference === 'Assisted Housing') {
      return "Assisted Housing Preference"
    } else {
      return "Rent Burdened Preference"
    }
  } else {
    return preference_name
  }
}

const getAttachments = (preference, proofFiles) => {
  const selectedProofFiles = filter(proofFiles, { related_application_preference: preference.id })
  return (!isEmpty(selectedProofFiles) &&
          <ProofFilesList proofFiles={selectedProofFiles} />)
}

const getTypeOfProof = (preference, proofFiles) => {
  ///p.type_of_proof
  if (isCOPorDHCP(preference.preference_name))
    return preference.certificate_number
  else
    return getAttachments(preference, proofFiles)
}


const buildRow = proofFiles => preference => {
  return [
    <PreferenceIcon status={preference.post_lottery_validation} />,
    getPreferenceName(preference),
    preference.person_who_claimed_name,
    preference.preference_lottery_rank,
    getTypeOfProof(preference, proofFiles),
    preference.post_lottery_validation
  ]
}

const onlyValid = (preferences) => {
  return reject(preferences, { lottery_status: 'Invalid for lottery' } )
}

/** Presenter **/

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

const ProofFilesList = ({proofFiles}) => {
  return (
    <ul>
      {
        proofFiles.map(file => (
          <li key={file.id}>
            <a href="#">{file.name}</a>
          </li>
        ))
      }
    </ul>
  )
}

const PreferencesTable = ({preferences, proofFiles }) => {
  const rows = map(onlyValid(preferences), buildRow(proofFiles))

  return (<ExpandableTable
            columns={columns}
            rows={rows}
            expanderRenderer={ExpanderAction}
            expandedRowRenderer={(row, toggle) => <ExpandedPanel onClose={toggle} /> }
          />)
}

export default PreferencesTable
