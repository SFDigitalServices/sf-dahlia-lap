import React from 'react'

import { reject, overSome, findIndex, orderBy, kebabCase } from 'lodash'

import TableWrapper from 'components/atoms/TableWrapper'
import ExpandableTable, { ExpanderButton } from 'components/molecules/ExpandableTable'
import {
  preferenceRowClosed,
  editPreferenceClicked
} from 'components/supplemental_application/actions/preferenceActionCreators'
import { useAppContext } from 'utils/customHooks'
import { addLayeredPreferenceFields } from 'utils/layeredPreferenceUtil'

import Panel from './preferences/Panel'
import PreferenceIcon from './preferences/PreferenceIcon'
import {
  isCOP,
  isDTHP,
  isAliceGriffith,
  isRightToReturn,
  getPreferenceName
} from './preferences/utils'

export const hasExpanderButton = (prefName) =>
  !overSome(isCOP, isDTHP, isAliceGriffith, isRightToReturn)(prefName)

const onlyValid = (preferences) => {
  return reject(preferences, (pref) => {
    return !pref.receives_preference
  })
}

const matchingPreference = (row) => (preference) => {
  return getPreferenceName(preference) === row[1].content
}

/** Presenter **/

const buildRow = (preference) => {
  return [
    { content: <PreferenceIcon status={preference.layered_validation} /> },
    { content: getPreferenceName(preference) },
    { content: preference.layered_member_names, classes: ['table-no-wrap'] },
    { content: preference.preference_lottery_rank, classes: ['text-right'] },
    { content: preference.layered_type_of_proofs, classes: ['table-no-wrap'] },
    { content: preference.layered_validation }
  ]
}

const buildRows = (preferences, proofFiles, applicationMembers, fileBaseUrl) => {
  const layeredPreferences = addLayeredPreferenceFields(
    preferences,
    proofFiles,
    fileBaseUrl,
    applicationMembers
  )
  return layeredPreferences.map(buildRow)
}

const sortAndFilter = (preferences) => {
  const sortedPreferences = orderBy(preferences, 'preference_order', 'asc')
  return onlyValid(sortedPreferences)
}

const customCellRenderer = (row) => {
  return row.map((datum, j) => {
    const finalContent = Array.isArray(datum.content)
      ? datum.content.map((item, i) => {
          const text = item || 'None'
          return <div key={i}>{text}</div>
        })
      : datum.content

    return (
      <td className={datum.classes ? datum.classes.join(' ') : ''} key={j}>
        {finalContent}
      </td>
    )
  })
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

  const sortedAndFilteredPreferences = sortAndFilter(application.preferences)

  const rows = buildRows(
    sortedAndFilteredPreferences,
    application.proof_files,
    applicationMembers,
    fileBaseUrl
  )

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
          customCellRenderer={customCellRenderer}
          originals={sortedAndFilteredPreferences}
          renderExpanderButton={(_, row, original, expanded) => {
            const prefName = row[1].content
            return (
              !expanded &&
              hasExpanderButton(original.custom_preference_type) && (
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
