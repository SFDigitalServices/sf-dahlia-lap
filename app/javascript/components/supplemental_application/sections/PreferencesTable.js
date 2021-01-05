import React from 'react'

import { reject, overSome, findIndex, orderBy, kebabCase } from 'lodash'

import { memberNameFromPref } from 'components/applications/application_form/preferences/utils'
import TableWrapper from 'components/atoms/TableWrapper'
import StatefulExpandableTable from 'components/molecules/StatefulExpandableTable'
import {
  preferenceRowClosed,
  editPreferenceClicked
} from 'components/supplemental_application/actions/preferenceActionCreators'
import { useAppContext } from 'utils/customHooks'

import Panel from './preferences/Panel'
import PreferenceIcon from './preferences/PreferenceIcon'
import { getTypeOfProof } from './preferences/typeOfProof'
import { isCOP, isDTHP, isAliceGriffith, getPreferenceName } from './preferences/utils'

const { ExpanderButton } = StatefulExpandableTable

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
  return onlyValid(sortedPreferences).map(buildRow(proofFiles, applicationMembers, fileBaseUrl))
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

/**
 * Get the index of the preference row in the application preferences array.
 *
 * Note that this is different from the index on the UI table, since what's shown is sorted and filtered.
 */
const getPreferenceIndex = (row, application) =>
  findIndex(application.preferences, matchingPreference(row))

const convertPreferenceToTableIndices = (preferenceIndices, tableRows, application) => {
  // map preference indices to UI table indices
  const preferenceIndexToRowIndex = Object.fromEntries(
    tableRows.map((row, index) => [getPreferenceIndex(row, application), index])
  )

  const expandedRowIndicesList = [...preferenceIndices]
    .map((preferenceIndex) => preferenceIndexToRowIndex[preferenceIndex])
    .filter((tableIndex) => tableIndex !== undefined)

  return new Set(expandedRowIndicesList)
}

const PreferencesTable = ({
  application,
  applicationMembers,
  fileBaseUrl,
  onSave,
  form,
  visited
}) => {
  const [
    {
      supplementalApplicationData: { supplemental: state }
    },
    dispatch
  ] = useAppContext()

  const rows = buildRows(application, applicationMembers, fileBaseUrl)

  const expandedRowIndices = convertPreferenceToTableIndices(
    state.openedConfirmedPreferenceIndices,
    rows,
    application
  )

  return (
    <div className='preferences-table'>
      <TableWrapper>
        <StatefulExpandableTable
          columns={columns}
          rows={rows}
          rowKeyIndex={1}
          expandedRowIndices={expandedRowIndices}
          renderExpanderButton={(_, row, expanded) => {
            const prefName = row[1].content
            return (
              !expanded &&
              hasExpanderButton(prefName) && (
                <ExpanderButton
                  label='Edit'
                  onClick={() =>
                    editPreferenceClicked(dispatch, getPreferenceIndex(row, application))
                  }
                  id={`${kebabCase(prefName)}-edit`}
                />
              )
            )
          }}
          renderRow={(_, row) => {
            const preferenceIndex = getPreferenceIndex(row, application)
            return (
              <Panel
                application={application}
                applicationMembers={applicationMembers}
                preferenceIndex={preferenceIndex}
                onSave={onSave}
                onClose={() => preferenceRowClosed(dispatch, preferenceIndex)}
                form={form}
                visited={visited}
              />
            )
          }}
        />
      </TableWrapper>
    </div>
  )
}

export default PreferencesTable
