import React from 'react'

import { map, reject, filter, isEmpty, overSome } from 'lodash'
import Icon from '~/components/atoms/Icon'
import ExpandableTable from '~/components/molecules/ExpandableTable'
import appPaths from '~/utils/appPaths'
import Panel from './preferences/Panel'

const { ExpanderButton } = ExpandableTable

/** Helpers **/

const isCOP = value => value.match(/COP/)

const isDTHP = value => value.match(/DTHP/)

const isGriffith = value => value.match(/Griffith/)

const hasExpanderButton = overSome(isCOP, isDTHP, isGriffith)

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
    } else if (individual_preference === 'Rent Burdened') {
      return "Rent Burdened Preference"
    } else {
      return preference_name
    }
  } else {
    return preference_name
  }
}

const getAttachments = (preference, proofFiles, fileBaseUrl) => {
  const selectedProofFiles = filter(proofFiles, { related_application_preference: preference.id })
  return (!isEmpty(selectedProofFiles) &&
          <ProofFilesList proofFiles={selectedProofFiles} fileBaseUrl={fileBaseUrl} />)
}

const getTypeOfProof = (preference, proofFiles, fileBaseUrl) => {
  if (isCOP(preference.preference_name) || isDTHP(preference.preference_name))
    return preference.certificate_number
  else if (isGriffith(preference.preference_name))
    return preference.type_of_proof
  else
    return getAttachments(preference, proofFiles, fileBaseUrl)
}


const buildRow = (proofFiles, fileBaseUrl) => preference => {
  return [
    <PreferenceIcon status={preference.post_lottery_validation} />,
    getPreferenceName(preference),
    preference.person_who_claimed_name,
    preference.preference_lottery_rank,
    getTypeOfProof(preference, proofFiles, fileBaseUrl),
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

const expandedRowRenderer = (row, toggle) => {
  return <Panel data={row} onClose={toggle} />
}

const ExpanderAction = (row, expanded, expandedRowToggler) => {
  return (!hasExpanderButton(row[1]) &&
          <ExpanderButton onClick={expandedRowToggler}/>)
}

const ProofFilesList = ({proofFiles, fileBaseUrl}) => {
  return (
    <ul>
      {
        proofFiles.map(file => (
          <li key={file.id}>
            <a
              href={appPaths.toAttachmentDownload(fileBaseUrl, file.id)}
              target="_blank"
            >
              {file.name}
            </a>
          </li>
        ))
      }
    </ul>
  )
}

//TODO: This could be extract and re use in following tables. x-large might need to be an attribute
const TableWrapper = ({children}) => (
  <div className="form-grid row expand">
    <div className="small-12 column">
      <div className="scrollable-table-container-under-xlarge">
        {children}
      </div>
    </div>
  </div>
)

const PreferencesTable = ({preferences, proofFiles, fileBaseUrl }) => {
  const rows = map(onlyValid(preferences), buildRow(proofFiles, fileBaseUrl))

  return (<TableWrapper>
            <ExpandableTable
              columns={columns}
              rows={rows}
              expanderRenderer={ExpanderAction}
              expandedRowRenderer={expandedRowRenderer}
            />
          </TableWrapper>)
}

export default PreferencesTable
