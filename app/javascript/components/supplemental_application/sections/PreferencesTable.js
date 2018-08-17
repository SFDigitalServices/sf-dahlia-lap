import React from 'react'
import { map, reject, isEmpty, overSome, findIndex } from 'lodash'

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
import AlertBox from '~/components/molecules/AlertBox'
import { getTypeOfProof } from './preferences/typeOfProof'
import { getFullHousehold } from '~/components/applications/application_form/preferences/utils'

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
    { content: preference.post_lottery_validation },
  ]
}

const buildRows = (application, fileBaseUrl) => {
  const { preferences, proofFiles } = application
  return map(onlyValid(preferences), buildRow(proofFiles, fileBaseUrl))
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

const expandedRowRenderer = (application, applicationMembers, onSave) => (row, toggle) => {
  const preferenceIndex = findIndex(application.preferences, matchingPreference(row))
  return <Panel
            application={application}
            preferenceIndex={preferenceIndex}
            applicationMembers={applicationMembers}
            onSave={onSave}
            onClose={toggle}
          />
}

const expanderAction = (row, expanded, expandedRowToggler) => {
  const prefName = row[1].content
  return (!expanded && hasExpanderButton(prefName) &&
          <ExpanderButton label="Edit" onClick={expandedRowToggler}/>)
}

class PreferencesTable extends React.Component {
  state = { failed: true }

  handleOnSave = async (preferenceIndex, application) => {
    const { onSave } = this.props

    await onSave(preferenceIndex, application)
    this.setState({ failed: true })
  }

  render() {
    const { application, fileBaseUrl } = this.props
    const { failed } = this.state
    const applicationMembers = getFullHousehold(application)
    const rows = buildRows(application, fileBaseUrl)
    return (
            <React.Fragment>
              { failed && (
                <AlertBox
                  invert
                  onCloseClick={() => this.setState({ failed: false })}
                  message="We weren't able to save your updates. Please try again" />
                )
              }
              <TableWrapper>
                <ExpandableTable
                  columns={columns}
                  rows={rows}
                  expanderRenderer={expanderAction}
                  expandedRowRenderer={expandedRowRenderer(application, applicationMembers, this.handleOnSave)}
                />
              </TableWrapper>
            </React.Fragment>
          )
  }
}

export default PreferencesTable
