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
    { content: <PreferenceIcon status={preference.post_lottery_validation} /> },
    { content: getPreferenceName(preference) },
    { content: preference.person_who_claimed_name },
    { content: preference.preference_lottery_rank, classes: ['text-right'] },
    { content: getTypeOfProof(preference, proofFiles, fileBaseUrl) },
    { content: preference.post_lottery_validation },
  ]
}

const onlyValid = (preferences) => {
  return reject(preferences, (pref) => {
    return !pref.receives_preference ||
           pref.lottery_status === 'Invalid for lottery' ||
           isEmpty(pref.application_member)
  })
}

/** Presenter **/

const columns = [
  { content: '' },
  { content: 'Preference Name' },
  { content: 'Person Who Claimed' },
  { content: 'Preference Rank', classes: ['text-right'] },
  { content: 'Type of proof' },
  { content: 'Status' },
  { content: 'Actions' }
]

const PreferenceIcon = ({ status }) => {
  if (status === "Invalid")
    return <Icon icon="close" size="medium" alert />
  else if (status === "Confirmed")
    return <Icon icon="check" size="medium" success />
  else
    return null
}

const matchingPreference = (row) => (preference) => {
  return getPreferenceName(preference) === row[1]
}

const expandedRowRenderer = (preferences, applicationMembers, onSave) => (row, toggle) => {
  const preference = find(preferences, matchingPreference(row))
  return <Panel
            preference={preference}
            row={row}
            applicationMembers={applicationMembers}
            onSave={onSave}
            onClose={toggle}
          />
}

const ExpanderAction = (row, expanded, expandedRowToggler) => {
  const prefName = row[1].content
  return (!hasExpanderButton(prefName) &&
          <ExpanderButton label="Edit" onClick={expandedRowToggler}/>)
}

const ProofFilesList = ({ proofFiles, fileBaseUrl }) => {
  return (
    <ul>
      {
        proofFiles.map(file => (
          <li key={file.id}>
            <a
              href={appPaths.toAttachmentDownload(fileBaseUrl, file.id)}
              className="block-link"
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
const TableWrapper = ({ children }) => (
  <div className="form-grid row expand">
    <div className="small-12 column">
      <div className="scrollable-table-container-under-xlarge">
        {children}
      </div>
    </div>
  </div>
)

const PreferencesTable = ({ preferences, applicationMembers, proofFiles, fileBaseUrl, onSave }) => {
  const rows = map(onlyValid(preferences), buildRow(proofFiles, fileBaseUrl))
  return (<TableWrapper>
            <ExpandableTable
              columns={columns}
              rows={rows}
              expanderRenderer={ExpanderAction}
              expandedRowRenderer={expandedRowRenderer(preferences, applicationMembers, onSave)}
            />
          </TableWrapper>)
}

export default PreferencesTable
