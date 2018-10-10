import React from 'react'
import { cond, stubTrue, constant } from 'lodash'

import FormGrid from '~/components/molecules/FormGrid'
import DefaultPanel from './DefaultPanel'
import RentBurdenedPanel from './RentBurdenedPanel'
import LiveOrWorkInSanFranciscoPanel from './LiveOrWorkInSanFranciscoPanel'
import NeighborhoodResidentHousingPanel from './NeighborhoodResidentHousingPanel'
import AntiDisplacementHousingPanel from './AntiDisplacementHousingPanel'
import AssistedHousingPanel from './AssistedHousingPanel'
import Custom from './Custom'
import { buildFieldId } from '~/components/applications/application_form/preferences/utils'

const isPreference = (record, preferenceName) => (pref) => {
  const recordtypeDevelopername = pref.recordtype_developername
  const individualPreference = pref.individual_preference
  return recordtypeDevelopername === record &&
    (
      !preferenceName ||
      individualPreference === preferenceName
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

const Panel = ({ application, preferenceIndex, onClose, onSave, loading, formApi }) => {
  const preference = application.preferences[preferenceIndex]
  const PreferencePanel = getPreferencePanel(preference)
  const onSaveWithPreferenceIndex = () => {
    onSave(preferenceIndex, formApi.values)
  }

  const handleOnClose = () => {
    formApi.setValue('total_monthly_rent', application.total_monthly_rent)
    formApi.setValue(['preferences', preferenceIndex], preference)
    onClose(preferenceIndex)
  }

  return (
    <div className='app-editable expand-wide scrollable-table-nested'>
      <React.Fragment>
        <PreferencePanel
          preferenceIndex={preferenceIndex}
          preference={preference}
        />
        <FormGrid.Row expand={false}>
          <div className='form-grid_item column'>
            <button
              className='button primary tiny margin-right margin-bottom-none save-panel-btn'
              type='button'
              onClick={onSaveWithPreferenceIndex}
              disabled={loading}>
              Save
            </button>
            <button
              className='button secondary tiny margin-bottom-none'
              type='button'
              onClick={handleOnClose}
              disabled={loading}>
              Cancel
            </button>
          </div>
        </FormGrid.Row>
      </React.Fragment>
    </div>
  )
}

class PanelContainer extends React.Component {
  state = { loading: false }

  handleOnSave = async (preferenceIndex, application) => {
    const { onSave } = this.props

    this.setState({ loading: true })
    await onSave(preferenceIndex, application)
    this.setState({ loading: false })
  }

  render () {
    const { onSave, ...rest } = this.props
    const { loading } = this.state

    return <Panel {...rest} onSave={this.handleOnSave} loading={loading} />
  }
}

export default PanelContainer
