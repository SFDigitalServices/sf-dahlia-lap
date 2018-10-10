import React from 'react'
import { map, reject, isEmpty, overSome, findIndex, orderBy } from 'lodash'

import TableWrapper from '~/components/atoms/TableWrapper'
import PreferenceIcon from './preferences/PreferenceIcon'
import ExpandableTable from '~/components/molecules/ExpandableTable'
import Panel from './preferences/Panel'
import {
  isCOP,
  isDTHP,
  isAliceGriffith,
  getPreferenceName
} from './preferences/utils'
import { getTypeOfProof } from './preferences/typeOfProof'
import { withContext } from '../context'

const { ExpanderButton } = ExpandableTable

const hasExpanderButton = (prefName) => !overSome(isCOP, isDTHP, isAliceGriffith)(prefName)

const onlyValid = (preferences) => {
  return reject(preferences, (pref) => {
    return !pref.receives_preference ||
           pref.lottery_status === 'Invalid for lottery' ||
           isEmpty(pref.application_member)
  })
}

const matchingPreference = (row) => (preference) => {
  return getPreferenceName(preference) === row[1].content
}

/** Presenter **/

const buildRow = (proofFiles, fileBaseUrl) => preference => {
  return [
    { content: <PreferenceIcon status={preference.post_lottery_validation} /> },
    { content: getPreferenceName(preference) },
    { content: preference.person_who_claimed_name },
    { content: preference.preference_lottery_rank, classes: ['text-right'] },
    { content: getTypeOfProof(preference, proofFiles, fileBaseUrl) },
    { content: preference.post_lottery_validation }
  ]
}

const buildRows = (application, fileBaseUrl) => {
  const { preferences } = application
  const proofFiles = application.proof_files
  const sortedPreferences = orderBy(preferences, 'preference_order', 'asc')
  return map(onlyValid(sortedPreferences), buildRow(proofFiles, fileBaseUrl))
}

const columns = [
  { content: '' },
  { content: 'Preference Name' },
  { content: 'Person Who Claimed' },
  { content: 'Preference Rank', classes: ['text-right'] },
  { content: 'Type of proof' },
  { content: 'Status' },
  { content: 'Actions' }
]

const expandedRowRenderer = (application, onSave, onPanelClose, formApi) => (row, toggle) => {
  const preferenceIndex = findIndex(application.preferences, matchingPreference(row))
  const handleOnClose = (preferenceIndex) => {
    toggle()
    onPanelClose && onPanelClose(preferenceIndex)
  }
  const handleOnSave = async (preferenceIndex, application) => {
    const response = await onSave(preferenceIndex, application)
    response && handleOnClose()
  }

  return (
    <Panel
      application={application}
      preferenceIndex={preferenceIndex}
      onSave={handleOnSave}
      onClose={handleOnClose}
      formApi={formApi}
    />
  )
}

const expanderAction = (row, expanded, expandedRowToggler) => {
  const prefName = row[1].content
  return (!expanded && hasExpanderButton(prefName) &&
    <ExpanderButton label='Edit' onClick={expandedRowToggler} />)
}

const PreferencesTable = ({ application, fileBaseUrl, onSave, onPanelClose, formApi }) => {
  const rows = buildRows(application, fileBaseUrl)
  return (
    <TableWrapper>
      <ExpandableTable
        columns={columns}
        rows={rows}
        expanderRenderer={expanderAction}
        expandedRowRenderer={expandedRowRenderer(application, onSave, onPanelClose, formApi)}
      />
    </TableWrapper>)
}

export default withContext(PreferencesTable)
