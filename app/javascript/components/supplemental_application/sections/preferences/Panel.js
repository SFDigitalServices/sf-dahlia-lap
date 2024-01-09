import React, { useState } from 'react'

import { cond, stubTrue, constant, map } from 'lodash'

import FormGrid from 'components/molecules/FormGrid'
import InlineModal from 'components/molecules/InlineModal'
import { isVeteran } from 'components/supplemental_application/sections/preferences/utils'

import AntiDisplacementHousingPanel from './AntiDisplacementHousingPanel'
import AssistedHousingPanel from './AssistedHousingPanel'
import Custom from './Custom'
import DefaultPanel from './DefaultPanel'
import LiveOrWorkInSanFranciscoPanel from './LiveOrWorkInSanFranciscoPanel'
import NeighborhoodResidentHousingPanel from './NeighborhoodResidentHousingPanel'
import RentBurdenedPanel from './RentBurdenedPanel'
import { hasExpanderButton } from '../PreferencesTable'

const isPreference = (recordType, preferenceName) => (pref) => {
  const recordtypeDevelopername = pref.recordtype_developername
  const individualPreference = pref.individual_preference

  // If preferenceName is provided, check that the individual preference matches it.
  return (
    recordtypeDevelopername === recordType &&
    (!preferenceName || individualPreference === preferenceName)
  )
}

const getPreferencePanel = cond([
  [isPreference('RB_AHP', 'Rent Burdened'), constant(RentBurdenedPanel)],
  [isPreference('RB_AHP', 'Assisted Housing'), constant(AssistedHousingPanel)],
  [isPreference('L_W'), constant(LiveOrWorkInSanFranciscoPanel)],
  [isPreference('NRHP'), constant(NeighborhoodResidentHousingPanel)],
  [isPreference('ADHP'), constant(AntiDisplacementHousingPanel)],
  [isPreference('Custom'), constant(Custom)],
  [stubTrue, constant(DefaultPanel)]
])

const Panel = ({
  application,
  applicationMembers,
  preferenceIndex,
  vetIndexes,
  onClose,
  onSave,
  loading,
  form,
  visited
}) => {
  const preference = application.preferences[preferenceIndex]
  const PreferencePanel = getPreferencePanel(preference)
  // TODO: need preference panel for non veteran because it may not be custom
  let NonVetPreferencePanel
  if (isVeteran(preference.preference_name)) {
    NonVetPreferencePanel = getPreferencePanel(application.preferences[preferenceIndex + 1])
  }

  const memberOption = (member) => {
    return { value: member.id, label: `${member.first_name} ${member.last_name}` }
  }
  const applicationMembersOptions = map(applicationMembers, memberOption)
  const onSaveWithPreferenceIndex = () => {
    if (vetIndexes && vetIndexes.length > 0) {
      // update all veteran prefs
      vetIndexes.forEach((i) => {
        form.getState().values.preferences[i].post_lottery_validation =
          form.getState().values.preferences[preferenceIndex].post_lottery_validation
        form.getState().values.preferences[i].type_of_proof =
          form.getState().values.preferences[preferenceIndex].type_of_proof
        form.getState().values.preferences[i].veteran_type_of_proof =
          form.getState().values.preferences[preferenceIndex].veteran_type_of_proof
        form.getState().values.preferences[i].person_who_claimed_name =
          form.getState().values.preferences[preferenceIndex].person_who_claimed_name
        onSave(i, form.getState().values)
      })

      // update non veteran if expandable, which is next element
      if (hasExpanderButton(application.preferences[preferenceIndex + 1].preference_name)) {
        onSave(preferenceIndex + 1, form.getState().values)
      }
    } else {
      // update only non veteran
      onSave(preferenceIndex, form.getState().values)
    }
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
        hasExpanderButton(application.preferences[preferenceIndex + 1].preference_name) && (
          <NonVetPreferencePanel
            preferenceIndex={preferenceIndex + 1}
            preference={application.preferences[preferenceIndex + 1]}
            form={form}
            applicationMembersOptions={applicationMembersOptions}
            visited={visited}
          />
        )}
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
