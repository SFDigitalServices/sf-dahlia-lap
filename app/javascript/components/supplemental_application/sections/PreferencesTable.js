import React from 'react'
import { map, reject, overSome, findIndex, orderBy, kebabCase } from 'lodash'

import TableWrapper from '~/components/atoms/TableWrapper'
import PreferenceIcon from './preferences/PreferenceIcon'
import ExpandableTable from '~/components/molecules/ExpandableTable'
import Panel from './preferences/Panel'
import { isCOP, isDTHP, isAliceGriffith, getPreferenceName } from './preferences/utils'
import { getTypeOfProof } from './preferences/typeOfProof'
import { withContext } from '../context'
import { memberNameFromPref } from '~/components/applications/application_form/preferences/utils'

const { ExpanderButton } = ExpandableTable

const hasExpanderButton = (prefName) => !overSome(isCOP, isDTHP, isAliceGriffith)(prefName)

const onlyValid = (preferences) => {
  return reject(preferences, (pref) => {
    return !pref.receives_preference
  })
}

const matchingPreference = (row) => (preference) => {
  return getPreferenceName(preference) === row[1].content
}

/** Presenter **/

const buildRow = (proofFiles, applicationMembers, fileBaseUrl) => (preference) => {
  return [
    { content: <PreferenceIcon status={preference.post_lottery_validation} /> },
    { content: getPreferenceName(preference) },
    { content: memberNameFromPref(preference.application_member_id, applicationMembers) },
    { content: preference.preference_lottery_rank, classes: ['text-right'] },
    { content: getTypeOfProof(preference, proofFiles, fileBaseUrl) },
    { content: preference.post_lottery_validation }
  ]
}

const buildRows = (application, applicationMembers, fileBaseUrl) => {
  const { preferences } = application
  const proofFiles = application.proof_files
  const sortedPreferences = orderBy(preferences, 'preference_order', 'asc')
  return map(onlyValid(sortedPreferences), buildRow(proofFiles, applicationMembers, fileBaseUrl))
}

const columns = [
  { content: '' },
  { content: 'Preference' },
  { content: 'Claimant' },
  { content: 'Rank', classes: ['text-right'] },
  { content: 'Proof' },
  { content: 'Status' },
  { content: '' }
]

const expandedRowRenderer = (
  application,
  applicationMembers,
  onSave,
  onPanelClose,
  form,
  visited
) => (row, toggle) => {
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
      applicationMembers={applicationMembers}
      preferenceIndex={preferenceIndex}
      onSave={handleOnSave}
      onClose={handleOnClose}
      form={form}
      visited={visited}
    />
  )
}

const expanderAction = (row, expanded, expandedRowToggler) => {
  const prefName = row[1].content
  return (
    !expanded &&
    hasExpanderButton(prefName) && (
      <ExpanderButton
        label='Edit'
        onClick={expandedRowToggler}
        id={`${kebabCase(prefName)}-edit`}
      />
    )
  )
}

const PreferencesTable = ({
  application,
  applicationMembers,
  fileBaseUrl,
  onSave,
  onPanelClose,
  form,
  visited
}) => {
  const rows = buildRows(application, applicationMembers, fileBaseUrl)
  return (
    <div className='preferences-table'>
      <TableWrapper>
        <ExpandableTable
          columns={columns}
          rows={rows}
          rowKeyIndex={1}
          expanderRenderer={expanderAction}
          expandedRowRenderer={expandedRowRenderer(
            application,
            applicationMembers,
            onSave,
            onPanelClose,
            form,
            visited
          )}
        />
      </TableWrapper>
    </div>
  )
}

export default withContext(PreferencesTable)
