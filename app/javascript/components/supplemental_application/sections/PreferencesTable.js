import React, { useMemo, useState } from 'react'

import { reject, overSome, findIndex, orderBy, kebabCase } from 'lodash'

import { memberNameFromPref } from 'components/applications/application_form/preferences/utils'
import TableWrapper from 'components/atoms/TableWrapper'
import ExpandableTable, { ExpanderButton } from 'components/molecules/ExpandableTable'
import {
  preferenceRowClosed,
  editPreferenceClicked
} from 'components/supplemental_application/actions/preferenceActionCreators'
import { useAppContext } from 'utils/customHooks'

import Panel from './preferences/Panel'
import PreferenceIcon from './preferences/PreferenceIcon'
import { getTypeOfProof } from './preferences/typeOfProof'
import {
  isCOP,
  isDTHP,
  isAliceGriffith,
  isRightToReturn,
  getPreferenceName
} from './preferences/utils'

const hasExpanderButton = (prefName) =>
  !overSome(isCOP, isDTHP, isAliceGriffith, isRightToReturn)(prefName)

const onlyValid = (preferences) => {
  return reject(preferences, (pref) => {
    return !pref.receives_preference || pref.preference_name.includes('Veterans')
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
  const validPrefs = onlyValid(sortedPreferences).map(
    buildRow(proofFiles, applicationMembers, fileBaseUrl)
  )
  const veteranPrefs = sortedPreferences.filter((pref) => pref.preference_name.includes('Veterans'))
  if (veteranPrefs.length > 0) {
    const veteranRow = buildRow(proofFiles, applicationMembers, fileBaseUrl)(veteranPrefs[0])
    validPrefs.unshift(veteranRow)
  }
  return validPrefs
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

  const [vetPrefIds, setVetPrefIds] = useState([])

  useMemo(() => {
    const ids = application.preferences
      .filter((pref) => pref.preference_name.includes('Veterans') && pref.receives_preference)
      .map((pref) => {
        return pref.preference_order - 1
      })
    setVetPrefIds(ids)
  }, [application.preferences])

  const rows = buildRows(application, applicationMembers, fileBaseUrl)

  const expandedRowIndices = convertPreferenceToTableIndices(
    state.preferenceRowsOpened,
    rows,
    application
  )

  return (
    <div className='preferences-table'>
      <TableWrapper>
        <ExpandableTable
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
            const preference = application.preferences[preferenceIndex]
            return (
              <Panel
                application={application}
                applicationMembers={applicationMembers}
                preferenceIndex={preferenceIndex}
                relatedIds={preference.preference_name.includes('Veterans') ? vetPrefIds : []}
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
