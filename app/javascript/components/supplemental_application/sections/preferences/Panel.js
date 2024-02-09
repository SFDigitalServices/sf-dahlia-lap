import React, { useState } from 'react'

import { cond, stubTrue, constant, map } from 'lodash'

import FormGrid from 'components/molecules/FormGrid'
import InlineModal from 'components/molecules/InlineModal'
import { hasExpanderButton } from 'components/supplemental_application/sections/PreferencesTable'
import { isVeteran } from 'utils/layeredPreferenceUtil'

import AntiDisplacementHousingPanel from './AntiDisplacementHousingPanel'
import AssistedHousingPanel from './AssistedHousingPanel'
import Custom from './Custom'
import DefaultPanel from './DefaultPanel'
import LayeredPreferencePanel from './LayeredPreferencePanel'
import LiveOrWorkInSanFranciscoPanel from './LiveOrWorkInSanFranciscoPanel'
import NeighborhoodResidentHousingPanel from './NeighborhoodResidentHousingPanel'
import RentBurdenedPanel from './RentBurdenedPanel'

const isPreference = (recordType, preferenceName) => (pref) => {
  const recordtypeDevelopername = pref.recordtype_developername
  const individualPreference = pref.individual_preference

  // If preferenceName is provided, check that the individual preference matches it.
  return (
    recordtypeDevelopername === recordType &&
    (!preferenceName || individualPreference === preferenceName)
  )
}

const isPreferenceVeteran = () => (pref) => isVeteran(pref.preference_name)

const getPreferencePanel = cond([
  [isPreference('RB_AHP', 'Rent Burdened'), constant(RentBurdenedPanel)],
  [isPreference('RB_AHP', 'Assisted Housing'), constant(AssistedHousingPanel)],
  [isPreference('L_W'), constant(LiveOrWorkInSanFranciscoPanel)],
  [isPreference('NRHP'), constant(NeighborhoodResidentHousingPanel)],
  [isPreference('ADHP'), constant(AntiDisplacementHousingPanel)],
  [isPreferenceVeteran(), constant(LayeredPreferencePanel)],
  [isPreference('Custom'), constant(Custom)],
  [stubTrue, constant(DefaultPanel)]
])

const Panel = ({
  application,
  applicationMembers,
  preferenceIndex,
  onClose,
  onSave,
  loading,
  form,
  visited
}) => {
  const preference = application.preferences[preferenceIndex]
  const PreferencePanel = getPreferencePanel(preference)
  const buildMatchingPreferencePanel = () => {
    const MatchingPreferencePanel = getPreferencePanel(application.preferences[preferenceIndex + 1])
    return (
      <MatchingPreferencePanel
        preferenceIndex={preferenceIndex + 1}
        preference={application.preferences[preferenceIndex + 1]}
        form={form}
        applicationMembersOptions={applicationMembersOptions}
        visited={visited}
      />
    )
  }

  const memberOption = (member) => {
    return { value: member.id, label: `${member.first_name} ${member.last_name}` }
  }
  const applicationMembersOptions = map(applicationMembers, memberOption)
  const onSaveWithPreferenceIndex = () => {
    // TODO: update all veteran preferences (move this to util)
    const indexesToUpdate = []
    if (isVeteran(form.getState().values.preferences[preferenceIndex].preference_name)) {
      const preferencesCopy = [...form.getState().values.preferences]
      preferencesCopy
        .filter((preference, index) => {
          const include =
            index !== preferenceIndex &&
            isVeteran(preference.preference_name) &&
            preference.receives_preference
          if (include) {
            indexesToUpdate.push(index)
          }
          return include
        })
        .forEach((preference) => {
          // TODO: rest of fields
          // TODO: Individual Preference Name for LW preferences
          preference.post_lottery_validation =
            form.getState().values.preferences[preferenceIndex].post_lottery_validation
          preference.veteran_type_of_proof =
            form.getState().values.preferences[preferenceIndex].veteran_type_of_proof
          preference.application_member_id =
            form.getState().values.preferences[preferenceIndex].application_member_id
        })
      form.change('preferences', preferencesCopy)
    }

    // TODO: save current preference + all veteran preferences + non veteran if expandable
    if (
      isVeteran(application.preferences[preferenceIndex].preference_name) &&
      hasExpanderButton(application.preferences[preferenceIndex + 1].preference_name)
    ) {
      indexesToUpdate.push(preferenceIndex + 1)
    }

    ;[preferenceIndex, ...indexesToUpdate].forEach((index) => onSave(index, form.getState().values))
  }

  const handleOnClose = () => {
    form.change('total_monthly_rent', application.total_monthly_rent)
    form.change(`preferences[${preferenceIndex}]`, preference)
    onClose(preferenceIndex)
  }

  return (
    <InlineModal>
      <PreferencePanel
        preferenceIndex={preferenceIndex}
        preference={preference}
        form={form}
        applicationMembersOptions={applicationMembersOptions}
        visited={visited}
      />
      {isVeteran(preference.preference_name) &&
        hasExpanderButton(application.preferences[preferenceIndex + 1].preference_name) &&
        buildMatchingPreferencePanel()}
      <FormGrid.Row expand={false}>
        <div className='form-grid_item column'>
          <button
            className='button primary tiny margin-right margin-bottom-none save-panel-btn'
            type='button'
            onClick={onSaveWithPreferenceIndex}
            disabled={loading}
          >
            Save
          </button>
          <button
            className='button secondary tiny margin-bottom-none'
            type='button'
            onClick={handleOnClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </FormGrid.Row>
    </InlineModal>
  )
}

const PanelContainer = ({ onSave, ...panelProps }) => {
  const [loading, setLoading] = useState(false)

  const handleOnSave = async (preferenceIndex, application) => {
    setLoading(true)
    await onSave(preferenceIndex, application)
    setLoading(false)
  }

  return <Panel {...panelProps} onSave={handleOnSave} loading={loading} />
}

export default PanelContainer
