import React from 'react'
import { Form } from 'react-form'
import { cond, stubTrue, constant } from 'lodash'

import { addNaturalKeyToPreference } from '~/components/applications/application_form/preferences/utils.js'
import FormGrid  from '~/components/molecules/FormGrid'
import DefaultPanel from './DefaultPanel'
import RentBurdenedPanel from './RentBurdenedPanel'
import LiveOrWorkInSanFranciscoPanel from './LiveOrWorkInSanFranciscoPanel'
import NeighborhoodResidentHousingPanel from './NeighborhoodResidentHousingPanel'
import AntiDisplacementHousingPanel from './AntiDisplacementHousingPanel'
import AssistedHousingPanel from './AssistedHousingPanel'
import Custom from './Custom'

const isPreference = (record, individualPreference) => ({recordtype_developername, individual_preference}) => {
  return recordtype_developername === record
    && (
      !individualPreference ||
      individual_preference === individualPreference
    )
}

const getPreferencePanel = cond([
  [isPreference('RB_AHP', 'Rent Burdened'),     constant(RentBurdenedPanel)],
  [isPreference('RB_AHP', 'Assisted Housing'),  constant(AssistedHousingPanel)],
  [isPreference('L_W'),                         constant(LiveOrWorkInSanFranciscoPanel)],
  [isPreference('NRHP'),                        constant(NeighborhoodResidentHousingPanel)],
  [isPreference('ADHP'),                        constant(AntiDisplacementHousingPanel)],
  [isPreference('Custom'),                      constant(Custom)],
  [stubTrue,                                    constant(DefaultPanel)]
])

const Panel = ({ preference, row, applicationMembers, onClose, onSave }) => {
  addNaturalKeyToPreference(preference)
  const PreferencePanel = getPreferencePanel(preference)
  return (

    <div className="app-editable expand-wide scrollable-table-nested">
        <Form onSubmit={onSave} defaultValues={preference}>
          { formApi => (
              <React.Fragment>
              <PreferencePanel preference={preference} applicationMembers={applicationMembers}/>
              <FormGrid.Row expand={false}>
                <div className="form-grid_item column">
              		<button className="button primary tiny margin-right margin-bottom-none" type="button" onClick={formApi.submitForm}>Save</button>
                  <button className="button secondary tiny margin-bottom-none" type="button" onClick={onClose}>Cancel</button>
              	</div>
              </FormGrid.Row>
              </React.Fragment>
            )
          }
        </Form>
    </div>
  )
}

export default Panel
