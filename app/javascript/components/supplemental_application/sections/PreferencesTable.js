import React from 'react'

import { map, reject, filter, isEmpty, overSome, find } from 'lodash'
import Icon from '~/components/atoms/Icon'
import ExpandableTable from '~/components/molecules/ExpandableTable'
import appPaths from '~/utils/appPaths'
import Panel from './preferences/Panel'
import {
  isCOP,
  isDTHP,
  isGriffith,
  getPreferenceName
} from './preferences/utils'

const { ExpanderButton } = ExpandableTable

const hasExpanderButton = overSome(isCOP, isDTHP, isGriffith)

const getAttachments = (preference, proofFiles, fileBaseUrl) => {
  const selectedProofFiles = filter(proofFiles, { related_application_preference: preference.id })
  return (!isEmpty(selectedProofFiles) &&
          <ProofFilesList proofFiles={selectedProofFiles} fileBaseUrl={fileBaseUrl} />)
}

const getTypeOfProof = (preference, proofFiles, fileBaseUrl) => {
  if (overSome(isCOP, isDTHP)(preference.preference_name))
    return preference.certificate_number
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
  return (status === "Invalid" ?
  <Icon icon="close" size="medium" alert />
  :
  <Icon icon="check" size="medium" success />)
}

const matchingPreference = (row) => (preference) => {
  return getPreferenceName(preference) === row[1]
}

const expandedRowRenderer = (preferences, applicationMembers) => (row, toggle) => {
  const preference = find(preferences, matchingPreference(row))
  return <Panel
            preference={preference}
            row={row}
            applicationMembers={applicationMembers}
            onClose={toggle}
          />
}

const expanderRenderer = (row, expanded, expandedRowToggler) => {
  return (!hasExpanderButton(row[1]) &&
          !expanded &&
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
              {file.document_type}
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

const PreferencesTable = ({ preferences, applicationMembers, proofFiles, fileBaseUrl }) => {
  const rows = map(onlyValid(preferences), buildRow(proofFiles, fileBaseUrl))

  return (<TableWrapper>
            <ExpandableTable
              columns={columns}
              rows={rows}
              expanderRenderer={expanderRenderer}
              expandedRowRenderer={expandedRowRenderer(preferences, applicationMembers)}
            />
          </TableWrapper>)
}

export default PreferencesTable
